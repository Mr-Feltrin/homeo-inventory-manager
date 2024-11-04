<?php

use App\Http\Controllers\ContainersController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ItemsController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RoomsController;
use App\Http\Controllers\SettingsController;
use App\Http\Controllers\CategoriesController;
use App\Http\Controllers\ActivityController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

// Public route for landing page
Route::get('/', function () {
    return Inertia::render('Public/Welcome');
})->name("welcome");

Route::middleware('auth')->group(function () {
    // Profile Routes
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Dashboard Routes
    Route::get('/dashboard', [DashboardController::class, 'view'])->name('dashboard');
    Route::get('/api/dashboard/total_user_storage', [DashboardController::class, 'totalUserStorage'])->name('dashboard.total_user_storage');

    // Settings Routes
    Route::get('/settings', [SettingsController::class, 'view'])->name('settings');

    // Activities Routes
    Route::get('/api/activities', [ActivityController::class, 'getActivities'])->name('activities');

    // Rooms Routes
    Route::get('/rooms/{id?}', [RoomsController::class, 'view'])->name('rooms');
    Route::get('/api/rooms', [RoomsController::class, 'getRooms'])->name('rooms.all');
    Route::get('/api/rooms/simple_list', [RoomsController::class, 'getRoomsListSimple'])->name('rooms.simple_list');
    Route::get('/api/rooms/search', [RoomsController::class, 'searchRooms'])->name('rooms.search');
    Route::get('/api/rooms/{room}/containers', [RoomsController::class, 'getRoomContainers'])->name('rooms.containers');
    Route::get('/api/rooms/{room}/containers/search', [RoomsController::class, 'searchRoomContainers'])->name('rooms.containers.search');
    Route::get('/api/rooms/{room}/items', [RoomsController::class, 'getRoomItems'])->name('rooms.items');
    Route::get('/api/rooms/{room}/items/search', [RoomsController::class, 'searchRoomItems'])->name('rooms.items.search');
    Route::get('/api/rooms/images/{filename}', [RoomsController::class, 'serveImage']);
    Route::post('/api/rooms', [RoomsController::class, 'store'])->name('rooms.store');
    Route::patch('/api/rooms/', [RoomsController::class, 'update'])->name('rooms.update');
    Route::delete('/api/rooms', [RoomsController::class, 'delete'])->name('rooms.delete');

    // Containers Routes
    Route::get('/containers/{id?}', [ContainersController::class, 'view'])->name('containers');
    Route::get('/api/containers/images/{filename}', [ContainersController::class, 'serveImage']);
    Route::get('/api/containers', [ContainersController::class, 'getContainers'])->name('containers.all');
    Route::get('/api/containers/simple_list', [ContainersController::class, 'getContainersListSimple'])->name('containers.simple_list');
    Route::get('/api/containers/search', [ContainersController::class, 'searchContainers'])->name('containers.search');
    Route::get('/api/containers/{container}/items', [ContainersController::class, 'getContainerItems'])->name('containers.items');
    Route::get('/api/containers/{container}/items/search', [ContainersController::class, 'searchContainerItems'])->name('containers.items.search');
    Route::post('/api/containers', [ContainersController::class, 'store'])->name('containers.store');
    Route::patch('/api/containers', [ContainersController::class, 'update'])->name('containers.update');
    Route::delete('/api/containers', [ContainersController::class, 'delete'])->name('containers.delete');

    // Items Routes
    Route::get('/items/{id?}', [ItemsController::class, 'view'])->name('items');
    Route::get('/api/items', [ItemsController::class, 'getItems'])->name('items.all');
    Route::get('/api/items/images/{filename}', [ItemsController::class, 'serveImage']);
    Route::get('/api/items/search', [ItemsController::class, 'searchItems'])->name('items.search');
    Route::post('/api/items', [ItemsController::class, 'store'])->name('items.store');
    Route::patch('/api/items/update', [ItemsController::class, 'update'])->name('items.update');
    Route::patch('/api/items/amount', [ItemsController::class, 'updateAmount'])->name('items.update_amount');
    Route::delete('/api/items', [ItemsController::class, 'delete'])->name('items.delete');

    // Categories Routes
    Route::get('/categories', [CategoriesController::class, 'view'])->name('categories');
    Route::get('/api/categories', [CategoriesController::class, 'getCategories'])->name('categories.all');
    Route::get('/api/categories/search', [CategoriesController::class, 'searchCategories'])->name('categories.search');
    Route::get('/api/categories/{category}/items', [CategoriesController::class, 'getCategoryItems'])->name('categories.items');
    Route::get('/api/categories/simple_list', [CategoriesController::class, 'getCategoriesListSimple'])->name('categories.simple_list');
    Route::post('/api/categories', [CategoriesController::class, 'store'])->name('categories.store');
    Route::patch('/api/categories', [CategoriesController::class, 'update'])->name('categories.update');
    Route::delete('/api/categories', [CategoriesController::class, 'delete'])->name('categories.delete');
});

require __DIR__ . '/auth.php';
