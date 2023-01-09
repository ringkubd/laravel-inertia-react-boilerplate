<?php

namespace App\Http\Controllers;

use App\Http\Resources\RoleResource;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolesController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        $roles = RoleResource::collection(Role::all());
        return Inertia::render('Security/Roles/Index', [
            'roles' => $roles,
            'can' => [
                'create' => auth()->user()->can('create_role'),
                'update' => auth()->user()->can('update_role'),
                'delete' => auth()->user()->can('delete_role'),
                'view' => auth()->user()->can('view_role'),
            ]
        ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Inertia\Response
     */
    public function create()
    {
        $role = new Role();
        return Inertia::render('Security/Roles/Create', [
            'role' => $role
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param Request $request
     * @return RedirectResponse
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|unique:roles'
        ]);
        Role::create($request->all());
        return redirect()->route('roles.index');
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Inertia\Response
     */
    public function show($id)
    {
        $role = new RoleResource(Role::findById($id));
        $users = User::whereDoesntHave('roles', function($q) use($id){
            $q->where('id', $id);
        })->get();

        return Inertia::render('Security/Roles/Show', [
            'role' => $role,
            'users' => $users,
            'can' => [
                'create' => auth()->user()->can('create_role'),
                'update' => auth()->user()->can('update_role'),
                'delete' => auth()->user()->can('delete_role'),
                'view' => auth()->user()->can('view_role'),
            ]
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Inertia\Response
     */
    public function edit($id)
    {
        $role = Role::findById($id);
        return Inertia::render('Security/Roles/Edit', [
            'role' => $role
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param Request $request
     * @param  int  $id
     * @return Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return Response
     */
    public function destroy($id)
    {

    }

    /**
     * @param Role $role
     * @param User $user
     * @return RedirectResponse
     */
    public function revoke(Role $role, User $user): RedirectResponse
    {
        if (auth()->user()->id !== $user->id){
            $role->users()->detach($user->id);
            session()->flash('success', "You have done it. Thank you.");
        }else{
            session()->flash('warning', "You can't remove your own roles.");
        }
        return redirect()->back();
    }

    /**
     * @param Role $role
     * @param User $user
     * @return RedirectResponse
     */

    public function invoke(Role $role, User $user): RedirectResponse
    {
        if (auth()->user()->id !== $user->id){
            $role->users()->attach($user->id);
            session()->flash('success', "You have done it. Thank you.");
        }else{
            session()->flash('warning', "You can't add your own roles.");
        }
        return redirect()->back();
    }

    public function rolePermission(Role $role){
        $permissions = Permission::query()
            ->select('permissions.*',DB::raw('substring_index(name, "_", -1) as permission_group'))
            ->orderBy('name')
            ->get()->groupBy('module')->toArray();
        return Inertia::render('Security/Roles/RolePermissions', [
            'role' => $role,
            'permissions' => $permissions,
            'existing_permissions' => $role->permissions->pluck('id')->toArray()
        ]);
    }

    public function updateRolePermission(Role $role, Request $request){
        $role->permissions()->sync($request->permissions);
        session()->flash('success', "You have done it. Thank you.");
        return back();
    }

}
