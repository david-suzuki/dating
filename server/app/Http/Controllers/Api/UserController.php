<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use App\Models\Role;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Validator;

class UserController extends Controller
{
    //
    public function __construct() {
        $this->middleware('auth:api', ['except' => []]);
    }
    /**
     * Response all data
     *
     * @return \Illuminate\Http\Response
     */
    public function getAll()
    {
        // $users = User::all();
        $users = User::whereNotIn('id', [1])->get();       // Except Admin user
        
        $records = [];
        foreach ($users as $user) {
            $record = [];
            $record['id'] = $user->id;
            $record['avatar'] = "";
            if (!is_null($user->profile))
                $record['avatar'] = $user->profile->avatar;
            $record['name'] = $user->name;
            $record['phone'] = $user->phone;
            $record['email'] = $user->email;
            $record['status'] = $user->status;

            $records[] = $record;
        }
        
        return response()->json([
            'message' => 'success',
            'users' => $records
        ], 200);
    }

    public function getAllBusinesses()
    {
        $users = User::all();
        $businesses = [];
        foreach ($users as $user) {
            $user->roles;
            if ($user->roles[0]->name == 'Business') {
                array_push($businesses, $user);
            }
        }
        return response()->json([
            'message' => 'success',
            'businesses' => $businesses
        ], 200);
    }

    /**
     * Response one data by id
     * 
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function getById(Request $request, $userId)
    {
        $user = User::find($userId);
        $user->roles;

        return response()->json([
            'message' => 'success',
            'user' => $user,
        ], 200);
    }

    /**
     * Create new data
     *
     * @return \Illuminate\Http\Response
     */
    public function create(Request $request) {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string',
            'company' => 'required|string',
            'phone' => 'required|string|max:11',
            'email' => 'required|email|max:100|unique:users',
            // 'password' => 'required|confirmed|min:8|max:16',
            'password' => 'required|min:8|max:16',
            'role' => 'required',
        ]);

        if($validator->fails()){
            return response()->json($validator->errors()->toJson(), 400);
        }

        $user = User::create(array_merge(
                    $validator->validated(),
                    ['password' => bcrypt($request->password)]
                ));
        
        $role = Role::where('name', $request->role)->first();
        $roleIds = [];
        array_push($roleIds, $role->id);
        $user->roles()->attach($roleIds);

        return response()->json([
            'message' => 'success',
            'user' => $user
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request)
    {
        // Update user
        $request->validate([
            'name' => 'required|string',
            'company' => 'required|string',
            'phone' => 'required|string|max:11',
            'email' => 'required|email|max:100',
            // 'password' => 'confirmed',
            // 'role' => 'required',
        ]);
        $user = User::find($request->id);
        if ($request->password) {
            $user -> update([
                'password' => bcrypt($request->password),
                'name' => $request->name,
                'company' => $request->company,
                'phone' => $request->phone,
                'email' => $request->email,
            ]);
        } else {
            $user -> update([
                'name' => $request->name,
                'company' => $request->company,
                'phone' => $request->phone,
                'email' => $request->email,
            ]);
        }

        // $role = Role::where('name', $request->role)->first();
        // $roleIds = [];
        // array_push($roleIds, $role->id);
        // $user->roles()->sync($roleIds);

        return response()->json([
            'message' => 'success',
            'user' => $user
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function delete($id)
    {
        // delete profile
        $profile = Profile::where('user_id', $id)->first();
        if (is_null($profile))
        {
            $profile->delete();
        }

        //delete User
        $user = User::find($id);
        $user -> delete();

        return response()->json([
            'message' => 'success'
        ], 200);
    }

    public function status(Request $request)
    {
        $id = $request->id;
        $status = $request->status;

        $user = User::find($id);
        $user->status = $status;

        $user->save();

        return response()->json([
            'message' => 'success'
        ], 200);
    }
}
