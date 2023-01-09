<?php

namespace App\Http\Controllers;

use App\Http\Resources\PermissionResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Spatie\Permission\Models\Permission;

class PermissionController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $this->authorize('view_permission');
        $permission = Permission::query()
            ->when($request->search, function ($q, $value) use ($request){
                $q->where('name', 'like', "%".$value . "%");
            })->paginate(10);
        $this->createAutoPermissions($this->module());
        return Inertia::render('Security/Permissions/Index', [
            'permissions' => PermissionResource::collection($permission),
            'can' => [
                'create' => auth()->user()->can('create_permissions'),
                'update' => auth()->user()->can('update_permissions'),
                'delete' => auth()->user()->can('delete_permissions'),
                'view' => auth()->user()->can('view_permissions'),
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
        $request->validate([
            'name' => 'required|unique:permissions'
        ]);
        $permission = Permission::create($request->all());
        session()->flash('success', 'Permission created successfully. Thank you.');
        return redirect()->back();
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
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $permission = Permission::findById($id);
        if ($permission->roles()->count() > 0 || $permission->users()->count() > 0){
            session()->flash('warning', 'This permission used on some role and user so please remove that before delete it. Thank you.');
            return redirect()->back();
        }
        $permission->delete();
        session()->flash('warning', 'You did it. Thank you');
        return redirect()->back();
    }

    /**
     * @return array
     */
    protected function module(){
        $routes = Route::getRoutes();
        $routeName = [];
        $numberOfDevide = [];
        foreach ($routes as $route){
            $module =  explode('.',$route->getName());
            $numberOfDevide[$route->getName()] = count($module);
            if (count($module) > 1 && !in_array($module[0], $routeName)) {
                if (count($module) == 2) {
                    $routeName [] = $module[0];
                }else{
                    $routeName [] = $module[0].'_'.$module[1];
                }
            }

        }
        return $routeName;
    }

    /**
     * @param array $modules
     * @return mixed
     */
    protected function createAutoPermissions(Array $modules){
        $permissions = Permission::whereIn('module', $modules)->get()->groupBy('module')->keys()->toArray();
        $exclude = config('custom.excluded_from_create_permission');
        $newModule = array_diff($modules, $exclude, $permissions);
        $defaultPermissions = config('custom.default_permissions');
        $newPermissions = [];
        $i = 0;
        foreach ($newModule as $module) {
            if (count($defaultPermissions) > 0) {
                $newP = array_map(function ($v) use($module, $i){
                    return [
                        'name' => $v.'_'.$module,
                        'guard_name' => 'web',
                        'module' => $module,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];
                }, $defaultPermissions);
                $permissions = Permission::insert($newP);
            }
            $i++;
        }
        return $permissions;
    }
}
