<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\Room;
use App\Models\Item;
use App\Models\Container;
use App\Models\Category;

class DashboardController extends Controller
{
    public function __construct()
    {
        $this->middleware('handle.exceptions');
    }

    // Displays the dashboard view
    public function view()
    {
        return Inertia::render("Dashboard/Dashboard");
    }

    // Display the amount of Rooms, Items, Containers and Categories user has registered
    public function totalUserStorage(Request $request)
    {
        $user = $request->user();

        $totalRooms = Room::where('user_id', $user->id)->count();
        $totalContainers = Container::whereHas('room', function ($query) use ($user) {
            $query->where('user_id', $user->id);
        })->count();
        $totalItems = Item::whereHas('container.room', function ($query) use ($user) {
            $query->where('user_id', $user->id);
        })->count();
        $totalCategories = Category::where('user_id', $user->id)->count();

        return response()->json([
            'total_rooms' => $totalRooms,
            'total_containers' => $totalContainers,
            'total_items' => $totalItems,
            'total_categories' => $totalCategories,
        ]);
    }
}
