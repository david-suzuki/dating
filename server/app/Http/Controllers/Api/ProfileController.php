<?php

namespace App\Http\Controllers\Api;

use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Models\Profile;
use App\Models\Role;
use App\Models\Like;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Validator;
use File;
use Storage;
use DB;

class ProfileController extends Controller
{
    //
    public function __construct() {
        // $this->middleware('auth:api', ['except' => []]);
    }
    /**
     * Response all data
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        // Get all users for guest user
        // $user = auth()->user();
        // if (is_null($user))
        //     $items = Profile::all(); 
        // else    
        //     $items = Profile::where('user_id', '<>', $user->id)->get();
        $user_id = 0;

        $user = auth()->user();
        if (!is_null($user))
            $user_id = $user->id;

        $items = Profile::all();
        $profiles = [];
        foreach ($items as $item) {
            $profile = [];
            $profile['id'] = $item->id;
            $profile['uid'] = $item->user->id;
            $profile['name'] = $item->user->name;
            $profile['avatar'] = $item->avatar;
            $profile['liked'] = false;

            // only when user login and only to the self's profile and other profiles that liked by self
            if ($user_id != 0)
            {
                $like = Like::where('from_id', $user_id)->where('to_id', $profile['uid'])->first();
                if (!is_null($like))
                    $profile['liked'] = true;
            }

            // on self's profile
            if ($item->user_id == $user_id)
                $profile['liked'] = true;
            
            $profiles[] = $profile;
        }
        
        return response()->json([
            'message' => 'success',
            'profile' => $profiles,
        ], 200);
    }

    public function getSearch(Request $request)
    {
        $user_id = 0;

        $user = auth()->user();
        if (!is_null($user))
            $user_id = $user->id;

        $search = json_decode($request->search);
        $search_val = $search->val;
        $search_field = $search->field;

        $query = "SELECT l.*, r.name AS uname FROM `profiles` AS l RIGHT JOIN users AS r ON l.user_id=r.id WHERE ";
        if ($search_field == "name")
            $query .= "r.name LIKE ?";
        else
            $query .= "l.$search_field LIKE ?";

        $items = DB::select($query, ["%$search_val%"]);

        $profiles = [];
        foreach ($items as $item) {
            $profile = [];
            $profile['id'] = $item->id;
            $profile['uid'] = $item->user_id;
            $profile['name'] = $item->uname;
            $profile['avatar'] = $item->avatar;
            $profile['liked'] = false;

            // only when user login and only other profiles that liked by self
            if ($user_id != 0)
            {
                $like = Like::where('from_id', $user_id)->where('to_id', $profile['uid'])->first();
                if (!is_null($like))
                    $profile['liked'] = true;
            }

            // on self's profile
            if ($item->user_id == $user_id)
                $profile['liked'] = true;
            
            $profiles[] = $profile;
        }

        return response()->json([
            'message' => 'success',
            'profile' => $profiles,
        ], 200);
    }

    /**
     * Response one data by id
     *
     * @return \Illuminate\Http\Response
     */
    public function getById($id)
    {
        $item = Profile::where('user_id', $id)->first();
        
        $profile = [];

        $profile['id'] = 0;
        // id in user table
        $profile['uid'] = $id;
        $profile['name'] = User::find($id)->name;
        $profile['birthday'] = "";
        $profile['birthplace'] = "";
        $profile['blood'] = "";
        $profile['language'] = "";
        $profile['character'] = "";
        $profile['play'] = "";
        $profile['job'] = "";
        $profile['income'] = "";
        $profile['education'] = "";
        $profile['living'] = "";
        $profile['faith'] = "";
        $profile['meal'] = "";
        $profile['interest'] = "";
        $profile['introduction'] = "";
        $profile['avatar'] = "";
        $profile['likedlist'] = [];
        $profile['favoritelist'] = [];
        $profile['liked'] = false;
        $profile['chatting'] = false;

        if (!is_null($item))
        {   
            $profile['id'] = $item->id;
            $profile['birthday'] = $item->birthday;
            $profile['birthplace'] = $item->birthplace;
            $profile['blood'] = $item->blood;
            $profile['language'] = $item->language;
            $profile['character'] = $item->character;
            $profile['play'] = $item->play;
            $profile['job'] = $item->job;
            $profile['income'] = $item->income;
            $profile['education'] = $item->education;
            $profile['living'] = $item->living;
            $profile['faith'] = $item->faith;
            $profile['meal'] = $item->meal;
            $profile['interest'] = $item->interest;
            $profile['introduction'] = $item->introduction;
            $profile['avatar'] = $item->avatar;
            
            $likes = Like::where('to_id', $profile['uid'])->latest()->take(5)->get()->unique('from_id');
            
            foreach ($likes as $like) {
                $row = [];
                $p = Profile::where('user_id', $like->from_id)->first();
                $row['avatar'] = $p->avatar;
                $row['name'] = $p->user->name;
                $row['id'] = $like->from_id;

                $profile['likedlist'][] = $row;
            }

            $favorites = Like::where('from_id', $profile['uid'])->latest()->take(5)->get()->unique('to_id');
            
            foreach ($favorites as $favorite) {
                $row = [];
                $p = Profile::where('user_id', $favorite->to_id)->first();
                $row['avatar'] = $p->avatar;
                $row['name'] = $p->user->name;
                $row['id'] = $favorite->to_id;

                $profile['favoritelist'][] = $row;
            }

            $user_id = 0;

            $user = auth()->user();
            if (!is_null($user))
                $user_id = $user->id;

            // only when user login and only to the self's profile and other profiles that liked by self
            if ($user_id != 0)
            {
                $like = Like::where('from_id', $user_id)->where('to_id', $id)->first();
                if (!is_null($like))
                    $profile['liked'] = true;
            }

            // on self's profile
            if ($id == $user_id)
                $profile['liked'] = true;

            // only when user and partner likes with each other
            $userlike = Like::where('from_id', $user_id)->where('to_id', $id)->where('status', 'approve')->first();
            $partnerlike = Like::where('from_id', $id)->where('to_id', $user_id)->where('status', 'approve')->first();
            if (!is_null($userlike) && !is_null($partnerlike)) {
                $profile['chatting'] = true;
            }
        }

        return response()->json([
            'message' => 'success',
            'profile' => $profile,
        ], 200);
    }
    /**
     * Response one data by id
     *
     * @return \Illuminate\Http\Response
     */
    public function getMyProfile()
    {
        $user = auth()->user();
        if ($user == null) {
            return response()->json([
                'message' => 'fail',
                'detail' => 'Not authorized'
            ], 200);
        }
                // $project->client;
        // $project->business;
        // $project->detail;
        // $project->requestData;
        // $project->deliverableData;
        $item = Profile::where('user_id', $user->id)->first();
        if ($item) {
            return response()->json([
                'message' => 'success',
                'profile' => $item,
            ], 200);
        }
        else {
            return response()->json([
                'message' => 'fail',
                'detail' => 'Profile is not created',
            ], 200);
        }
    }
    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request)
    {
        $user = auth()->user();
        if ($user == null) {
            return response()->json([
                'message' => 'fail',
                'detail' => 'Not authorized'
            ], 200);
        }

        // Update user
        $request->validate([
            'name' => 'required|string',
            'birthplace' => 'required|string',
            'birthday' => 'required|string',
            'blood' => 'required|string',
            'language' => 'required|string',
            'character' => 'required|string',
            'play' => 'required|string',
            'job' => 'required|string',
            'income' => 'required|string',
            'education' => 'required|string',
            'living' => 'required|string',
            'faith' => 'required|string',
            'meal' => 'required|string',
            'interest' => 'required|string',
            'introduction' => 'required|string',
        ]);

        $user = User::find($user->id);
        $user->name = $request->name;
        $user->save();

        $item = Profile::where('user_id', $user->id)->first();
        if ($item) {
            if ($request->password) {
                $item ->update([
                    'password' => bcrypt($request->password),
                    'name' => $request->name,
                    'birthplace' => $request->birthplace,
                    // 'phone' => $request->phone,
                    // 'email' => $request->email,
                ]);
            } else {

                $item->birthplace = $request->birthplace;
                $item->birthday = $request->birthday;
                $item->blood = $request->blood;
                $item->language = $request->language;
                $item->character = $request->character;
                $item->play = $request->play;
                $item->job = $request->job;
                $item->income = $request->income;
                $item->education = $request->education;
                $item->living = $request->living;
                $item->faith = $request->faith;
                $item->meal = $request->meal;
                $item->interest = $request->interest;
                $item->introduction = $request->introduction;

                $avatar = $request->file('file');
                if ($avatar) {
                    $avatar = $request->file('file')->store('avatars');
                    $storage_avatar = storage_path('app/' . $avatar);
                    $filepath = pathinfo($storage_avatar)['filename'] . "." . pathinfo($storage_avatar)['extension'];

                    if (!file_exists(public_path('avatars'))) {
                        mkdir(public_path('avatars'));
                    }                    

                    // Moving file from storage to public
                    $public_avatar = public_path('avatars/' . $filepath);
                    File::move($storage_avatar, $public_avatar);
                    Storage::delete($avatar);

                    // if user's old avatar already exists, then delete it
                    $old_avatar = $item->avatar;
                    if (isset($old_avatar) && $old_avatar !== "")
                    {
                        unlink(public_path('avatars/' . $old_avatar));
                    }
                    $item->avatar = $filepath;
                }

                $item->save();
            }
        }
        else {

            $item = new Profile;
            $item->user_id = $user->id;
            $item->birthplace = $request->birthplace;
            $item->birthday = $request->birthday;
            $item->blood = $request->blood;
            $item->language = $request->language;
            $item->character = $request->character;
            $item->play = $request->play;
            $item->job = $request->job;
            $item->income = $request->income;
            $item->education = $request->education;
            $item->living = $request->living;
            $item->faith = $request->faith;
            $item->meal = $request->meal;
            $item->interest = $request->interest;
            $item->introduction = $request->introduction;

            $avatar = $request->file('file');
            if ($avatar) {
                $avatar = $request->file('file')->store('avatars');
                $storage_avatar = storage_path('app/' . $avatar);
                $filepath = pathinfo($storage_avatar)['filename'] . "." . pathinfo($storage_avatar)['extension'];

                if (!file_exists(public_path('avatars'))) {
                    mkdir(public_path('avatars'));
                }                    

                // Moving file from storage to public
                $public_avatar = public_path('avatars/' . $filepath);
                File::move($storage_avatar, $public_avatar);
                Storage::delete($avatar);

                $item->avatar = $filepath;
            }

            $item->save();
        }

        return response()->json([
            'message' => 'success',
            'profile' => $item
        ], 200);
    }
 
    public function updateMail(Request $request)
    {
        // Update user
        $request->validate([
            'email' => 'required|email|max:100',
        ]);

        $user = User::find($request->id);
        $user -> update([
            'email' => $request->email,
        ]);

        return response()->json([
            'message' => 'success',
            'user' => $user
        ], 200);
    }
    public function updatePasswd(Request $request)
    {
        // Update user
        $user = User::find($request->id);
        $user -> update([
            'password' => bcrypt($request->passwd),
        ]);

        return response()->json([
            'message' => 'success',
            'user' => $user
        ], 200);
    }

    public function setLike($id)
    {
        $user = auth()->user();
        if (is_null($user->profile))
        {
            return response()->json([
                'message' => 'error',
            ], 200);       
        }

        $from_id = $user->id;

        $like = new Like;
        $like->from_id = $from_id;
        $like->to_id = $id;

        $like->save();

        $isChat = false;
        $like = Like::where('from_id', $id)->where('to_id', $from_id)->first();
        if (!is_null($like))
            $isChat = true;

        return response()->json([
            'message' => 'success',
            'chatting' => $isChat,
        ], 200);
    }

    public function setUnLike($id)
    {
        $user = auth()->user();
        if (is_null($user->profile))
        {
            return response()->json([
                'message' => 'error',
            ], 200);       
        }

        $from_id = $user->id;
        $like = Like::where('from_id', $from_id)->where('to_id', $id)->first();
        if (is_null($like))
        {
            return response()->json([
                'message' => 'error',
            ], 200);   
        }

        $like->delete();

        return response()->json([
            'message' => 'success',
            'chatting' => false,
        ], 200);   
    }

    public function getApproaves($id)
    {
        $likes = Like::where('to_id', $id)->get();
        $records = [];
        foreach ($likes as $like) {
            $record = [];
            $record['id'] = $like->id;
            $record['avatar'] = $like->from->profile->avatar;
            $record['name'] = $like->from->name;
            $record['status'] = $like->status;

            $records[] = $record;
        }

        return response()->json([
            'message' => 'success',
            'list' => $records,
        ], 200);   
    }

    public function setApproaves(Request $request)
    {
        $approaves = json_decode($request->approaves);
        foreach ($approaves as $approave) {
            $like = Like::find($approave->id);
            $like->status = $approave->status;

            $like->save();
        }

        return response()->json([
            'message' => 'success',
        ], 200);   
    }
}
