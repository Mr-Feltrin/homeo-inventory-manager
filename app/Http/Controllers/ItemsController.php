<?php

namespace App\Http\Controllers;

use App\Helpers\ImageHelper;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Item;
use Illuminate\Support\Facades\Storage;

class ItemsController extends Controller
{
    public function __construct()
    {
        $this->middleware('handle.exceptions');
    }

    public function view(int $id = null)
    {
        if ($id !== null) {
            try {
                $item = Item::with([
                    'container' => function ($query) {
                        $query->select('id', 'name', 'room_id')->with(['room' => function ($query) {
                            $query->select('id', 'name');
                        }]);
                    },
                    'category' => function ($query) {
                        $query->select('id', 'name');
                    }
                ])->findOrFail($id);

                $this->authorize('view', $item);

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

                return Inertia::render('Items/Items', [
                    'item' => $item,
                ]);
            } catch (Exception) {
                return Inertia::render('Items/Items');
            }
        } else {
            return Inertia::render('Items/Items');
        }
    }

    // Retrieve all items with pagination
    public function getItems(Request $request)
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
        ])->whereHas('container', function ($query) use ($request) {
            $query->whereHas('room', function ($query) use ($request) {
                $query->where('user_id', $request->user()->id);
            });
        })->select('id', 'name', 'amount', 'container_id', 'category_id', 'details', 'image', 'created_at', 'updated_at')
            ->paginate(12);

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

    // Performs a search for items based on a query string
    public function searchItems(Request $request)
    {
        $search = strtolower($request->input('search'));

        $items = Item::with(['container' => function ($query) {
            $query->select('id', 'name', 'room_id')->with(['room' => function ($query) {
                $query->select('id', 'name');
            }]);
        }, 'category' => function ($query) {
            $query->select('id', 'name');
        }])->whereHas('container', function ($query) use ($request) {
            $query->whereHas('room', function ($query) use ($request) {
                $query->where('user_id', $request->user()->id);
            });
        })->whereRaw("LOWER(name) like '%{$search}%'")
            ->select('id', 'name', 'amount', 'container_id', 'category_id', 'details', 'image', 'created_at', 'updated_at')
            ->paginate(12);

        if ($items->isEmpty()) {
            return apiErrorResponse(['message' => 'No items found'], 404);
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


    public function serveImage(string $filename)
    {
        return ImageHelper::serveImage('items', $filename);
    }

    // Stores a new item
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'container_id' => 'required|integer|exists:containers,id',
            'category_id' => 'required|integer|exists:categories,id',
            'details' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'amount' => 'required|numeric'
        ]);

        $imageName = null;

        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imageName = ImageHelper::generateImageName($request->user(), $image);
            $image->storeAs('images/items', $imageName);
        }

        $item = new Item([
            'name' => $request->input('name'),
            'user_id' => $request->user()->id,
            'container_id' => $request->input('container_id'),
            'category_id' => $request->input('category_id'),
            'details' => $request->input('details'),
            'image' => $imageName,
            'amount' => $request->input('amount')
        ]);

        $item->save();

        if ($item->image) {
            $item->image = url("api/items/images/{$item->image}");
        }
        $item->category_name = $item->category->name ?? null;
        $item->container_name = $item->container->name ?? null;
        $item->room_id = $item->container->room_id;
        $item->room_name = $item->container->room->name ?? null;
        $item->makeHidden(['container', 'category']);

        return response()->json(['message' => 'Item successfully created.', 'item' => $item], 200);
    }

    // Updates an item
    public function update(Request $request)
    {
        $request->validate([
            'id' => 'required|integer|exists:items,id',
            'name' => 'required|string|max:255',
            'container_id' => 'required|integer|exists:containers,id',
            'category_id' => 'required|integer|exists:categories,id',
            'details' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'amount' => 'required|numeric'
        ]);

        $item = Item::findOrFail($request->input('id'));

        $this->authorize('update', $item);

        $item->fill([
            'name' => $request->input('name'),
            'container_id' => $request->input('container_id'),
            'category_id' => $request->input('category_id'),
            'details' => $request->input('details'),
            'amount' => $request->input('amount') === $item->amount ? $item->amount : $request->input('amount')
        ]);

        if ($request->hasFile('image')) {

            if ($item->image) {
                Storage::delete("images/items/{$item->image}");
            }

            $image = $request->file('image');
            $imageName = ImageHelper::generateImageName($request->user(), $image);
            $image->storeAs('images/items', $imageName);
            $item->image = $imageName;
        } else if ($request->has('image') && is_null($request->input('image')) && $item->image) {
            Storage::delete("images/items/{$item->image}");
            $item->image = null;
        }

        $item->save();

        if ($item->image) {
            $item->image = url("api/items/images/{$item->image}");
        }
        $item->category_name = $item->category->name ?? null;
        $item->container_name = $item->container->name ?? null;
        $item->room_id = $item->container->room_id;
        $item->room_name = $item->container->room->name ?? null;
        $item->makeHidden(['container', 'category']);

        return response()->json(['message' => 'Item successfully updated.', 'item' => $item], 200);
    }

    public function updateAmount(Request $request)
    {
        $request->validate([
            'id' => 'required|integer|exists:items,id',
            'amount' => 'required|numeric'
        ]);

        $item = Item::findOrFail($request->input('id'));

        $this->authorize('update', $item);

        $item->amount = $request->input('amount') === $item->amount ? $item->amount : $request->input('amount');

        $item->save();

        return response()->json(['message' => 'Item amount successfully updated.', 'item' => $item], 200);
    }

    // Deletes an item
    public function delete(Request $request)
    {
        $request->validate([
            'id' => 'required|integer|exists:items,id',
        ]);

        $item = Item::findOrFail($request->input('id'));

        $this->authorize('delete', $item);
        $item->delete();

        return response()->json(['message' => 'Item has been successfully deleted'], 200);
    }
}
