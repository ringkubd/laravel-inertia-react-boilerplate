<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
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

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';

Route::middleware('auth')->group(function (){
    Route::resource('roles', \App\Http\Controllers\RolesController::class);
    Route::post('role/{role}/{user}', [\App\Http\Controllers\RolesController::class, 'revoke'])->name('roles.revoke');
    Route::post('update_role_user/{role}/{user}/add', [\App\Http\Controllers\RolesController::class, 'invoke'])->name('roles.invoke');
    Route::get('role_permissions/{role}', [\App\Http\Controllers\RolesController::class, 'rolePermission'])->name('role.permission');
    Route::post('role_permissions/{role}', [\App\Http\Controllers\RolesController::class, 'updateRolePermission'])->name('role.permission.update');
    Route::resource('users', \App\Http\Controllers\UsersController::class);

    Route::put('users/role/update/{user}', [\App\Http\Controllers\UsersController::class, 'updateRole'])->name('users.update_role');
    Route::get('users/permission/{user}', [\App\Http\Controllers\UsersController::class, 'userPermission'])->name('users.user_permission');
    Route::post('users/permission/{user}/update', [\App\Http\Controllers\UsersController::class, 'userPermissionUpdate'])->name('users.update_permission');

    // Permission
    Route::resource('permissions', \App\Http\Controllers\PermissionController::class);
});
