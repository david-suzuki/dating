<?php

namespace App\Http\Controllers\Api;

use App\Models\Message;
use App\Models\User;

use App\Mail\ContactEmail;
use App\Mail\ChatNotiEmail;
use Illuminate\Support\Facades\Mail;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Validator;

class ContactController extends Controller
{
    //
    // public function __construct() {
    //     $this->middleware('auth:api', ['except' => []]);
    // }
    /**
     * Response all data
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'company' => 'required',
            'name' => 'required',
            'phone' => 'required',
            'email' => 'required',
            'content' => 'required',
        ]);        
        if($validator->fails()){
            return response()->json($validator->errors()->toJson(), 400);
        }

        $email = new ContactEmail();
        $email->title = 'お問い合わせ通知[Simple-Point]';
        $email->company = $request->company;
        $email->username = $request->name;
        $email->phone = $request->phone;
        $email->email = $request->email;
        $email->content = $request->content;

        Mail::to('info@apex.tokyo')->send($email);

        return response()->json([
            'message' => 'success',
        ], 200);
    }

    public function notifyChat(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id' => 'required',
        ]);
        if($validator->fails()){
            return response()->json($validator->errors()->toJson(), 400);
        }

        $message = Message::find($request->id);
        $message->is_notified = 1;
        $message->save();

        $messages = Message::where('project_id', $message->project_id)
            ->where('is_notified', 0)->where('uto', $message->uto)->get();
        foreach ($messages as $key => $message) {
            $message->is_notified = 1;
            $message->save();
        }

        $user = User::find($message->uto);
        if ($user->roles[0]->name == 'Client') {
            $email = new ChatNotiEmail();
            $email->title = '未読チャットのお知らせ[Simple-Point]';
            $email->company = $user->company;
            $email->username = $user->name;
            $email->url = 'http://simple-point.net/admin/projectdetail/' . $message->project_id;

            Mail::to($user->email)->send($email);
        }

        return response()->json([
            'message' => 'success',
            'result' => $message
        ], 200);
    }    

    public function markChatMessage($id)
    {
        $message = Message::find($id);
        $message->is_read = 1;
        $message->save();

        return response()->json([
            'message' => 'success',
            'result' => $message
        ], 200);
    }    

    public function markChatMessageProject($projectId)
    {
        $messages = Message::where('project_id', $projectId)->where('is_read', 0)->get();
        foreach ($messages as $key => $message) {
            $message->is_read = 1;
            $message->save();
        }        

        return response()->json([
            'message' => 'success',
        ], 200);
    }    
}
