<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use App\Http\Resources\UserResources;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class UsersController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $users = User::with('roles', 'permissions')->get();
        return Inertia::render('Security/Users/Index', [
            'users' => UserResources::collection($users),
            'can' => [
                'create' => auth()->user()->can('create_users'),
                'update' => auth()->user()->can('update_users'),
                'delete' => auth()->user()->can('delete_users'),
                'view' => auth()->user()->can('view_users'),
            ]
        ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit(User $user)
    {
        $roles = Role::all();
        return Inertia::render('Security/Users/Edit', [
            'user' => $user->load('roles', 'permissions'),
            'roles' => $roles
        ]);
    }

    /**
     * Update the user's profile information.
     *
     * @param  \App\Http\Requests\ProfileUpdateRequest  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(ProfileUpdateRequest $request)
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        return back();
    }

    /**
     * Delete the user's account.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy(Request $request)
    {
        $request->validate([
            'password' => ['required', 'current-password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }

    public function updateRole(User $user, Request $request){
        $user->roles()->sync($request->roles);
        session()->flash('success', 'User roles assigned successfully. Thank you.');
        return back();
    }

    public function userPermission(User $user){
        $permissions = Permission::query()
            ->select('permissions.*',DB::raw('substring_index(name, "_", -1) as permission_group'))
            ->orderBy('name')
            ->get()->groupBy('module')->toArray();

        return Inertia::render('Security/Users/UserPermissions', [
            'user' => $user,
            'permissions' => $permissions,
            'existing_permissions' => $user->permissions()->pluck('id'),
            'can' => [
                'create' => auth()->user()->can('create_users'),
                'update' => auth()->user()->can('update_users'),
                'delete' => auth()->user()->can('delete_users'),
                'view' => auth()->user()->can('view_users'),
            ]
        ]);
    }
    public function userPermissionUpdate(User $user, Request $request){
        $user->permissions()->sync($request->permissions);
        session()->flash('success', 'User permissions assigned successfully. Thank you.');
        return back();
    }
}
