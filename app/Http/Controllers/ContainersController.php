<?php

namespace App\Http\Controllers;

use App\Helpers\ImageHelper;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Container;
use Illuminate\Support\Facades\Storage;
use App\Models\Room;
use Exception;
use Inertia\Response;
use Illuminate\Http\JsonResponse;
use App\Models\Item;

class ContainersController extends Controller
{
    public function __construct()
    {
        $this->middleware('handle.exceptions');
    }

    // Show the containers page
    public function view(int $id = null): Response
    {
        if ($id !== null) {
            try {
                $container = Container::findOrFail($id);
                $this->authorize('view', $container);
                return Inertia::render('Containers/Containers', [
                    'container' => $container,
                ]);
            } catch (Exception) {
                return Inertia::render('Containers/Containers');
            }
        } else {
            return Inertia::render('Containers/Containers');
        }
    }

    // Retrieve a list of containers with pagination
    public function getContainers(Request $request): JsonResponse
    {
        $containers = Container::with(['room' => function ($query) {
            $query->select('id', 'name');
        }])->whereHas('room', function ($query) use ($request) {
            $query->where('user_id', $request->user()->id);
        })->select('id', 'name', 'room_id', 'details', 'image', 'created_at', 'updated_at')
            ->withCount(['items as total_items'])
            ->orderBy('created_at', 'desc')
            ->paginate(12);

        $containers->getCollection()->transform(function ($container) {
            if ($container->room) {
                $container->room_name = $container->room->name;
            }
            if ($container->image) {
                $container->image = url("api/containers/images/{$container->image}");
            }

            $container->makeHidden(['room']);
            return $container;
        });

        return response()->json($containers);
    }

    // Search for a container
    public function searchContainers(Request $request): JsonResponse
    {
        $search = strtolower($request->input('search'));

        $containers = Container::with(['room' => function ($query) {
            $query->select('id', 'name');
        }])->whereHas('room', function ($query) use ($request) {
            $query->where('user_id', $request->user()->id);
        })->whereRaw("LOWER(name) like '%{$search}%'")
            ->select('id', 'name', 'details', 'room_id', 'image', 'created_at', 'updated_at')
            ->withCount(['items as total_items'])
            ->paginate(12);

        if ($containers->isEmpty()) {
            return apiErrorResponse(['message' => 'No containers found'], 404);
        }

        $containers->getCollection()->transform(function ($container) {
            if ($container->room) {
                $container->room_name = $container->room->name;
            }
            if ($container->image) {
                $container->image = url("api/containers/images/{$container->image}");
            }

            $container->makeHidden(['room']);
            return $container;
        });

        return response()->json($containers);
    }

    // Search for items related to the container
    public function searchContainerItems(Request $request, Container $container) {
        // search for the item related to the container
        $search = strtolower($request->input('search'));

        $items = Item::with([
            'container' => function ($query) {
                $query->select('id', 'name', 'room_id')->with(['room' => function ($query) {
                    $query->select('id', 'name');
                }]);
            },
            'category' => function ($query) {
                $query->select('id', 'name');
            }
        ])->where('container_id', $container->id)
            ->whereRaw("LOWER(name) like '%{$search}%'")
            ->select('id', 'name', 'amount', 'container_id', 'category_id', 'details', 'image', 'created_at', 'updated_at')
            ->paginate(10);
    
        if ($items->isEmpty()) {
            return response()->json(['message' => 'No items found'], 404);
        }
    
        $items->getCollection()->transform(function ($item) {
            if ($item->container) {
                $item->container_name = $item->container->name;
                $item->room_id = $item->container->room_id;
                $item->room_name = $item->container->room?->name;
            }
            if ($item->category) {
                $item->category_name = $item->category->name;
            }
            if ($item->image) {
                $item->image = url("api/items/images/{$item->image}");
            }
            $item->makeHidden(['container', 'category']);
            return $item;
        });
    
        return response()->json($items);
        
    }

    // Get a list of containers with only the id and name, accepts a room_id parameter to filter the containers
    public function getContainersListSimple(Request $request)
    {
        if ($request->has('room_id')) {
            $room = Room::where('id', $request->room_id)
                ->where('user_id', $request->user()->id)
                ->firstOrFail();

            $containers = Container::where('room_id', $room->id)
                ->select('id', 'name')
                ->get();
        } else {
            $containers = Container::whereHas('room', function ($query) use ($request) {
                $query->where('user_id', $request->user()->id);
            })->select('id', 'name')
                ->get();
        }

        return response()->json($containers);
    }

    // Function to find items related to the container
    public function getContainerItems(Container $container)
    {
        $items = $container->items()->select('id', 'name', 'amount', 'details', 'image', 'category_id', 'container_id', 'updated_at')->paginate(10);

        $items->transform(function ($item) use ($container) {
            $item->container_name = $container->name;
            $item->room_name = $container->room?->name;
            $item->room_id = $container->room_id;
            $item->category_name = $item->category?->name;
            if ($item->image) {
                $item->image = url("api/items/images/{$item->image}");
            }
            $item->makeHidden(['category']);
            return $item;
        });

        return response()->json($items);
    }


    // Add a new Container
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'details' => 'nullable|string|max:250',
            'room_id' => 'required|integer|exists:rooms,id',
        ]);

        if ($request->hasFile('image')) {
            $request->validate([
                'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg,bmp|max:2048',
            ]);
        }

        $imageName = null;

        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imageName = ImageHelper::generateImageName($request->user(), $image);
            $image->storeAs('images/containers', $imageName);
        }

        $container = new Container([
            'name' => $request->input('name'),
            'details' => $request->input('details'),
            'room_id' => $request->input('room_id'),
            'image' => $imageName,
        ]);

        $container->save();

        if ($container->image) {
            $container->image = url("api/containers/images/{$container->image}");
        }
        $container->room_name = $container->room->name ?? null;
        $container->total_items = $container->items()->count();
        $container->makeHidden(['room']);
        return response()->json(['message' => 'Container has been successfully created', "container" => $container], 200);
    }

    // Updates a container
    public function update(Request $request)
    {
        $request->validate([
            'id' => 'required|integer|exists:containers,id',
            'name' => 'required|string',
            'details' => 'nullable|string',
            'room_id' => 'required|numeric|exists:rooms,id',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg,bmp|max:2048',
        ]);

        $container = Container::findOrFail($request->input('id'));

        $this->authorize('update', $container);

        $container->fill([
            'name' => $request->input('name'),
            'details' => $request->input('details') !== '' ? $request->input('details') : null,
            'room_id' => $request->input('room_id'),
        ]);

        if ($request->hasFile('image')) {
            if ($container->image) {
                Storage::delete("images/containers/{$container->image}");
            }

            $image = $request->file('image');
            $imageName = ImageHelper::generateImageName($request->user(), $image);
            $image->storeAs('images/containers', $imageName);
            $container->image = $imageName;
        } elseif ($request->has('image') && is_null($request->input('image')) && $container->image) {
            Storage::delete("images/containers/{$container->image}");
            $container->image = null;
        }

        $container->save();

        if ($container->image) {
            $container->image = url("api/containers/images/{$container->image}");
        }
        $container->total_items = $container->items()->count();
        $container->room_name = $container->room->name ?? null;
        $container->makeHidden(['room']);

        return response()->json(['message' => 'Container has been successfully updated', 'container' => $container], 200);
    }

    public function serveImage($filename)
    {
        return ImageHelper::serveImage('containers', $filename);
    }

    // make a delete function
    public function delete(Request $request)
    {
        $request->validate([
            'id' => 'required|integer|exists:containers,id',
        ]);
        $container = Container::findOrFail($request->input('id'));

        $this->authorize('delete', $container);
        $container->delete();

        return response()->json(['message' => 'Container has been successfully deleted'], 200);
    }
}
