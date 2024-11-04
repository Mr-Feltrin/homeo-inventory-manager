<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Category;

// Controller for handling category related operations
class CategoriesController extends Controller
{
    public function __construct()
    {
        $this->middleware('handle.exceptions');
    }

    public function view()
    {
        return Inertia::render('Categories/Categories');
    }

    // Retrieve the categories of the user paginated
    public function getCategories(Request $request)
    {
        $categories = Category::where('user_id', $request->user()->id)
            ->select('id', 'name', 'created_at', 'updated_at')
            ->paginate(10);

        return $categories;
    }

    // Retrieve the items of a category
    public function getCategoryItems(Category $category)
    {
        $items = $category->items()->select('id', 'name', 'details', 'image', 'category_id', 'container_id', 'updated_at')->get();

        $items->transform(function ($item) use ($category) {
            $item->container_name = $item->container?->name;
            $item->room_name = $item->container && $item->container->room ? $item->container->room->name : null;
            $item->room_id = $item->container?->room_id;
            $item->category_name = $category->name;
            if ($item->image) {
                $item->image = url("api/items/images/{$item->image}");
            }
            $item->makeHidden(['container']);
            return $item;
        });

        return response()->json($items);
    }

    // Search for categories based on a query string
    public function searchCategories(Request $request)
    {
        $search = strtolower($request->input('search'));

        $categories = Category::where('user_id', $request->user()->id)
            ->whereRaw("LOWER(name) like '%{$search}%'")
            ->select('id', 'name', 'created_at', 'updated_at')
            ->paginate(10);

        if ($categories->isEmpty()) {
            return response()->json(['message' => 'No categories found'], 404);
        }

        return response()->json($categories);
    }

    // Retrieve a list of all categories containing only id and name
    public function getCategoriesListSimple(Request $request)
    {
        $categories = Category::where('user_id', $request->user()->id)
            ->select('id', 'name')
            ->get();

        return response()->json($categories);
    }

    // Add a new Category
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
        ]);

        $category = new Category();
        $category->name = $request->name;
        $category->user_id = $request->user()->id;
        $category->save();

        return response()->json(['message' => 'Category added successfully'], 201);
    }

    // Update a Category
    public function update(Request $request)
    {
        $request->validate([
            'id' => 'required|exists:categories,id',
            'name' => 'required|string',
        ]);

        $category = Category::findOrFail($request->input('id'));

        $this->authorize('update', $category);
        $category->name = $request->input('name');

        $category->save();

        return response()->json(['message' => 'Category updated successfully'], 200);
    }

    // Delete a Category
    public function delete(Request $request)
    {
        $request->validate([
            'id' => 'required|exists:categories,id',
        ]);

        $category = Category::findOrFail($request->input('id'));
        $this->authorize('delete', $category);

        $category->delete();

        return response()->json(['message' => 'Category removed successfully'], 200);
    }
}
