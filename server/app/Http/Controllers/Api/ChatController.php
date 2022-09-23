<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Message;
use App\Models\User;
use App\Models\Like;

use DB;

class ChatController extends Controller
{
    public function list($id)
    {
        $chat_id_list = [];

        $send_messages = Message::where('ufrom', $id)->get();
        foreach ($send_messages as $message) {
            $to_id = $message->uto;
            if (!in_array($to_id, $chat_id_list))
                array_push($chat_id_list, $to_id);
        }

        $receive_messages = Message::where('uto', $id)->get();
        foreach ($receive_messages as $message) {
            $from_id = $message->ufrom;
            if (!in_array($from_id, $chat_id_list))
                array_push($chat_id_list, $from_id);
        }

        $chat_users = [];
        foreach ($chat_id_list as $id) {
            $chat_user = [];
            $user = User::find($id);
            $chat_user['id'] = $user->id;
            $chat_user['avatar'] = $user->profile->avatar;
            $chat_user['name'] = $user->name;

            $chat_users[] = $chat_user;
        }

        return response()->json([
            'message' => 'success',
            'list' => $chat_users
        ], 200);
    }

    public function search(Request $request)
    {
        $user_id = 0;

        $user = auth()->user();
        if (!is_null($user))
            $user_id = $user->id;

        $searchTxt = $request->searchText;

        // getting the user list with searchText
        $users = User::where('name','LIKE','%'.$searchTxt.'%')->get();

        $chat_users = [];
        // checking the likes table with above users
        foreach ($users as $user) 
        {
            $id = $user->id;
            $mylike = Like::where('from_id', $user_id)->where('to_id', $id)->first();
            $likeme = Like::where('from_id', $id)->where('to_id', $user_id)->first();

            if (!is_null($mylike) && !is_null($likeme)) 
            {
                $chat_user = [];
                $chat_user['id'] = $id;
                $chat_user['avatar'] = $user->profile->avatar;
                $chat_user['name'] = $user->name;

                $chat_users[] = $chat_user;
            }
        }

        if (count($chat_users) > 0)
        {
            return response()->json([
                'message' => 'success',
                'list' => $chat_users
            ], 200);
        }

        return response()->json([
            'message' => 'noresult',
        ], 200);
    }

    public function getUnreadNum($id)
    {
        $unread_messages = Message::where('uto', $id)->where('is_read', 0)->get()->count();

        return response()->json([
            'message' => 'success',
            'unread' => $unread_messages
        ], 200);   
    }
}
