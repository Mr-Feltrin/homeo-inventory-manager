<?php

namespace App\Http\Controllers;

use App\Helpers\ImageHelper;
use App\Models\Room;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Item;
use Illuminate\Support\Facades\Storage;
use Exception;

class RoomsController extends Controller
{
    public function __construct()
    {
        $this->middleware('handle.exceptions');
    }

    // Get the Rooms index page
    public function view(int $id = null)
    {
        if ($id !== null) {
            try {
                $room = Room::findOrFail($id);
                $this->authorize('view', $room);
                return Inertia::render('Rooms/Rooms', [
                    'room' => $room
                ]);
            } catch (Exception) {
                return Inertia::render('Rooms/Rooms');
            }
        }
        else {
            return Inertia::render('Rooms/Rooms');
        }
    }

    // Retrieve all the rooms from database with pagination
    public function getRooms(Request $request)
    {
        $rooms = Room::where('user_id', $request->user()->id)
            ->select('id', 'name', 'description', 'image', 'created_at', 'updated_at')
            ->withCount('containers')
            ->orderBy('created_at', 'desc')
            ->paginate(8);

        foreach ($rooms as $room) {
            $room->items_count = Item::whereHas('container', function ($query) use ($room) {
                $query->where('room_id', $room->id);
            })->count();
            if ($room->image) {
                $room->image = url("api/rooms/images/{$room->image}");
            }
        }

        return response()->json($rooms);
    }

    // Get all the rooms from database with only id and name
    public function getRoomsListSimple(Request $request)
    {
        $rooms = Room::where('user_id', $request->user()->id)
            ->select('id', 'name', 'description')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($rooms);
    }

    // Get all the containers from a specific room
    public function getRoomContainers(Room $room)
    {
        $containers = $room->containers()
            ->select('id', 'name', 'details', 'room_id', 'image', 'created_at', 'updated_at')
            ->withCount(['items as total_items'])
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        $containers->getCollection()->transform(function ($container) use ($room) {
            if ($container->image) {
                $container->image = url("api/containers/images/{$container->image}");
            }
            $container->room_name = $room->name;
            $container->makeHidden(['room']);
            return $container;
        });

        return response()->json($containers);
    }

    // Search for a container related to a room with a search term
    public function searchRoomContainers(Request $request, Room $room)
    {
        $search = strtolower($request->input('search'));

        $containers = $room->containers()
            ->select('id', 'name', 'details', 'room_id', 'image', 'created_at', 'updated_at')
            ->withCount('items')
            ->whereRaw("LOWER(name) like '%{$search}%'")
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        if ($containers->isEmpty()) {
            return response()->json(['message' => 'No containers found'], 404);
        }

        $containers->getCollection()->transform(function ($container) {
            if ($container->image) {
                $container->image = url("api/containers/images/{$container->image}");
            }
            return $container;
        });

        return response()->json($containers);
    }

    // Get all the items from a specific room
    public function getRoomItems(Room $room)
    {
        $items = Item::with([
            'container' => function ($query) {
                $query->select('id', 'name', 'room_id')->with(['room' => function ($query) {
                    $query->select('id', 'name');
                }]);
            },
            'category' => function ($query) {
                $query->select('id', 'name');
            }
        ])->whereHas('container', function ($query) use ($room) {
            $query->where('room_id', $room->id);
        })->select('id', 'name', 'amount', 'container_id', 'category_id', 'details', 'image', 'created_at', 'updated_at')
            ->paginate(10);

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

    // Search for an item related to a room with a search term
    public function searchRoomItems(Request $request, Room $room)
    {
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
        ])->whereHas('container', function ($query) use ($room) {
            $query->where('room_id', $room->id);
        })->whereRaw("LOWER(name) like '%{$search}%'")
            ->select('id', 'name', 'container_id', 'category_id', 'details', 'image', 'created_at', 'updated_at')
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


    // Store a new Room
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'description' => 'nullable|string|max:250',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg,bmp|max:2048',
        ]);

        $imageName = null;

        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imageName = ImageHelper::generateImageName($request->user(), $image);
            $image->storeAs('images/rooms', $imageName);
        }

        $room = new Room([
            'name' => $request->input('name'),
            'description' => $request->input('description'),
            'user_id' => $request->user()->id,
            'image' => $imageName,
        ]);

        $room->save();
    }

    // Returns the image file from the rooms image path
    public function serveImage(string $filename)
    {
        return ImageHelper::serveImage('rooms', $filename);
    }

    // Update Room Informations
    public function update(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'description' => 'nullable|string|max:250',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg,bmp|max:2048',
            'id' => 'required|integer',
        ]);

        $room = Room::findOrFail($request->input('id'));

        $this->authorize('update', $room);

        $room->fill([
            'name' => $request->input('name'),
            'description' => $request->input('description')
        ]);

        if ($request->hasFile('image')) {
            if ($room->image) {
                Storage::delete("images/rooms/{$room->image}");
            }
            $image = $request->file('image');
            $imageName = ImageHelper::generateImageName($request->user(), $image);
            $image->storeAs('images/rooms', $imageName);
            $room->image = $imageName;
        } elseif ($request->has('image') && is_null($request->input('image')) && $room->image) {
            Storage::delete("images/rooms/{$room->image}");
            $room->image = null;
        }

        $room->save();

        return response()->json(['message' => 'Room has been successfully updated'], 200);
    }

    // Seek for specific room names
    public function searchRooms(Request $request)
    {
        $searchTerm = $request->input('search');

        $matchingRooms = Room::where('user_id', $request->user()->id)
            ->where('name', 'like', "%{$searchTerm}%")
            ->select('id', 'name', 'description', 'user_id', 'image')
            ->withCount('containers')
            ->orderBy('created_at', 'desc')
            ->paginate(8);

        if (!$matchingRooms->isEmpty()) {
            foreach ($matchingRooms as $room) {
                if ($room->image) {
                    $room->image = url("api/rooms/images/{$room->image}");
                }
            }
            return response()->json($matchingRooms);
        } else {
            return apiErrorResponse(['message' => 'No rooms found with the search term provided'], 404);
        }
    }


    // Delete a Room
    public function delete(Request $request)
    {
        $request->validate([
            'id' => 'required|integer',
        ]);

        $room = Room::findOrFail($request->input('id'));
        $this->authorize('delete', $room);
        $room->delete();
        return response()->json(['message' => 'Room has been removed successfully']);
    }
}
