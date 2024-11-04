<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class SettingsController extends Controller
{
    // Displays the settings view
    public function view(): Response
    {
        return Inertia::render('Settings/Settings');
    }
}
