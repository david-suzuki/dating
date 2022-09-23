<?php

namespace App\Http\Controllers\Api;
use Illuminate\Http\Request;

use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Models\Role;
use Notification;
use App\Notifications\AlertNotification;
use Validator;
use App\Http\Controllers\Controller;

use App\Mail\CreatedEmail;
use Illuminate\Support\Facades\Mail;

use Socialite;
class AuthController extends Controller
{
    // $default_password = "123";

    /**
     * Create a new AuthController instance.
     *
     * @return void
     */
    public function __construct() {
        $this->middleware('auth:api', ['except' => ['login', 'register', 'resetPassword','googleRegister', 'googleLogin', 'facebookRegister', 'facebookLogin', 'linkedinRegister', 'linkedinLogin']]);
    }

    /**
     * Get a JWT via given credentials.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function login(Request $request){
        // print_r('socialLogin');
    	$validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required|string|min:6',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        // $credentials = request(['email', 'password']);
 
        // if (! $token = auth()->attempt($credentials)) {
        //     return response()->json(['error' => 'Unauthorized'], 401);
        // }
        
        // return $this->createNewToken($token);
        
        // For showing of correct error message
        $users = User::where('email', $request->email)->get();
        if (count($users) > 0) {
            $user = $users[0];
            if (! $token = auth()->attempt($validator->validated())) {
                return response()->json([
                    'message' => '入力されたパスワードが正しくありません。',
                ], 401);
            }
            return $this->createNewToken($token);
        } else {
            return response()->json([
                'message' => '入力されたメールアドレスが正しくありません。',
            ], 401);
        }
    }

    /**
     * Register a User.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function register(Request $request) {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string',
            // 'company' => 'required|string',
            // 'phone' => 'required|string',
            'email' => 'required|email|max:100|unique:users',
            // 'password' => 'required|confirmed|min:8|max:16',
            'password' => 'required|min:8|max:16',
        ]);

        if($validator->fails()){
            return response()->json($validator->errors()->toJson(), 400);
        }

        $user = User::create(array_merge(
                    $validator->validated(),
                    ['password' => bcrypt($request->password)]
                ));
        $user->roles()->attach([2]);    // Default role is client on registration

        // $details = [
        //     'greeting' => 'Hi Artisan',
        //     'body' => 'This is my first notification from ItSolutionStuff.com',
        //     'thanks' => 'Thank you for using ItSolutionStuff.com tuto!',
        //     'actionText' => 'View My Site',
        //     'actionURL' => url('/'),
        //     'order_id' => 101
        // ];
          // Notification::send($user, new AlertNotification($details));
        $email = new CreatedEmail();
        $email->title = '会員登録完了のお知らせ[Simple-Point]';
        // $email->company = $request->company;
        // $email->username = $request->name;
        // $email->url = route('login');
        $email->url = 'http://simple-point.net/auth/login';
        // Mail::to($request->email)->send($email);

        return response()->json([
            'message' => 'success',
            'user' => $user
        ], 200);
    }

    public function resetPassword(Request $request)
    {
        // dd($request->all());
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|max:100',
            // 'password' => 'required|confirmed|min:8|max:16',
            'password' => 'required|min:8|max:16',
        ]);

        if($validator->fails()){
            return response()->json($validator->errors()->toJson(), 400);
        }

        $users = User::where('email', $request->email)->get();
        if (count($users) > 0) {
            $user = $users[0];
            $user -> update([
                'password' => bcrypt($request->password),
            ]);
        } else {
            return response()->json([
                'message' => '入力されたメールアドレスが正しくありません。',
            ], 401);
        }
        return response()->json([
            'message' => 'success',
            'user' => $user
        ], 200);
    }


    /**
     * Log the user out (Invalidate the token).
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout() {
        auth()->logout();

        return response()->json(['message' => 'User successfully signed out']);
    }

    /**
     * Refresh a token.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function refresh() {
        return $this->createNewToken(auth()->refresh());
    }

    /**
     * Get the authenticated User.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function userProfile() {
        return response()->json(auth()->user());
    }

    /**
     * Get the token array structure.
     *
     * @param  string $token
     *
     * @return \Illuminate\Http\JsonResponse
     */
    protected function createNewToken($token){
        auth()->user()->roles;
        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth()->factory()->getTTL() * 60000,
            'user' => auth()->user()
        ]);
    }

    /**
     * Get auth user
     * 
     * @return App\Models\User
     */
    public function auth() {
        // return response()->json('date');
        return response()->json(auth()->user());
    }

    public function googleRegister(Request $request)
    {
        $access_token = $request->accessToken;

        $url = 'https://www.googleapis.com/oauth2/v1/tokeninfo?access_token='.$access_token;
        
        $curl = curl_init();
        curl_setopt($curl, CURLOPT_URL, $url);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
        $output = curl_exec($curl);

        $account_mail = json_decode($output)->email;

        curl_close($curl);

        $isAuthed = false;
        if (filter_var($account_mail, FILTER_VALIDATE_EMAIL)) {
            $isAuthed = true;

            $user = User::where('email', $account_mail)->first();
            if (is_null($user))
            {
                $user = new User;
                $user->name = explode("@", $account_mail)[0];
                $user->email = $account_mail;
                // $user->password = bcrypt($this->default_password)    
                $user->password = bcrypt(substr($access_token, 0, 10));    
            }
            else
            {
                $user->password = bcrypt(substr($access_token, 0, 10)); 
            }
            
            $user->save();        
        }
        return response()->json([
            'isAuth' => $isAuthed,
        ], 200);
    }

    public function googleLogin(Request $request)
    {
        $access_token = $request->accessToken;

        $url = 'https://www.googleapis.com/oauth2/v1/tokeninfo?access_token='.$access_token;
        
        $curl = curl_init();
        curl_setopt($curl, CURLOPT_URL, $url);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
        $output = curl_exec($curl);

        $account_mail = json_decode($output)->email;

        curl_close($curl);

        $isAuthed = false;
        if (filter_var($account_mail, FILTER_VALIDATE_EMAIL)) {

            $user = User::where('email', $account_mail)->first();
            if (!is_null($user))
            {
                if (! $token = auth()->attempt(['email' => $account_mail, 'password' => substr($access_token, 0, 10)])) {
                    return response()->json([
                        'message' => '入力されたパスワードが正しくありません。',
                    ], 401);
                }
                
                auth()->user()->roles;
                $isAuthed = true;
                return response()->json([
                    'access_token' => $token,
                    'token_type' => 'bearer',
                    'expires_in' => auth()->factory()->getTTL() * 60000,
                    'user' => auth()->user(),
                    'isAuth' => $isAuthed        
                ]);
            }
        }

        return response()->json([
            'isAuth' => $isAuthed,
        ]);
    }

    public function facebookRegister(Request $request)
    {
        $access_token = $request->accessToken;

        $url = 'https://graph.facebook.com/app?access_token='.$access_token;
        
        $curl = curl_init();
        curl_setopt($curl, CURLOPT_URL, $url);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
        $output = curl_exec($curl);

        $account_mail = json_decode($output)->email;

        curl_close($curl);

        $isAuthed = false;
        if (filter_var($account_mail, FILTER_VALIDATE_EMAIL)) {
            $isAuthed = true;

            $user = User::where('email', $account_mail)->first();
            if (is_null($user))
            {
                $user = new User;
                $user->name = explode("@", $account_mail)[0];
                $user->email = $account_mail;
                // $user->password = bcrypt($this->default_password)    
                $user->password = bcrypt(substr($access_token, 0, 10));    
            }
            else
            {
                $user->password = bcrypt(substr($access_token, 0, 10)); 
            }
            
            $user->save();        
        }
        return response()->json([
            'isAuth' => $isAuthed,
        ], 200);
    }

    public function facebookLogin(Request $request)
    {
        $access_token = $request->accessToken;

        $url = 'https://graph.facebook.com/app?access_token='.$access_token;
        
        $curl = curl_init();
        curl_setopt($curl, CURLOPT_URL, $url);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
        $output = curl_exec($curl);

        $account_mail = json_decode($output)->email;

        curl_close($curl);

        $isAuthed = false;
        if (filter_var($account_mail, FILTER_VALIDATE_EMAIL)) {

            $user = User::where('email', $account_mail)->first();
            if (!is_null($user))
            {
                if (! $token = auth()->attempt(['email' => $account_mail, 'password' => substr($access_token, 0, 10)])) {
                    return response()->json([
                        'message' => '入力されたパスワードが正しくありません。',
                    ], 401);
                }
                
                auth()->user()->roles;
                $isAuthed = true;
                return response()->json([
                    'access_token' => $token,
                    'token_type' => 'bearer',
                    'expires_in' => auth()->factory()->getTTL() * 60000,
                    'user' => auth()->user(),
                    'isAuth' => $isAuthed        
                ]);
            }
        }

        return response()->json([
            'isAuth' => $isAuthed,
        ]);
    }

    public function linkedinRegister(Request $request)
    {
        $code = $request->code;
        $urlToGetLinkedInAccessToken = "https://www.linkedin.com/oauth/v2/accessToken";
        $LINKEDIN_CLIENT_ID = 'XXXXXXXXXX';
        $LINKEDIN_CLIENT_SECRET = 'XXXXXXXX';
        $LINKEDIN_REDIRECT_URI = 'http://localhost:3000';
        $LINKEDIN_SCOPE = 'r_liteprofile%20r_emailaddress';
        $LINKEDIN_STATE = '123456'; 

        // getting accessToken from code
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $urlToGetLinkedInAccessToken);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS,
            "grant_type=authorization_code&code=$code&redirect_uri=$LINKEDIN_REDIRECT_URI&client_id=$LINKEDIN_CLIENT_ID&client_secret=$LINKEDIN_CLIENT_SECRET");
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $output = curl_exec($ch);
        curl_close ($ch);

        $access_token = json_decode($output)->access_token;
        if (is_null($access_token))
        {
            return response()->json([
                'isAuth' => false,
            ]);
        }

        $urlToGetUserEmail = 'https://api.linkedin.com/v2/clientAwareMemberHandles?q=members&projection=(elements*(primary,type,handle~))';
        
        $curl = curl_init();
        curl_setopt($curl, CURLOPT_URL, $urlToGetUserEmail);
        curl_setopt($curl, CURLOPT_HTTPHEADER, array(
            "Authorization: Bearer $accessToken"
        ));
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
        $output = curl_exec($curl);

        $account_mail = json_decode($output)[0]->handle;

        curl_close($curl);

        $isAuthed = false;
        if (filter_var($account_mail, FILTER_VALIDATE_EMAIL)) {
            $isAuthed = true;

            $user = User::where('email', $account_mail)->first();
            if (is_null($user))
            {
                $user = new User;
                $user->name = explode("@", $account_mail)[0];
                $user->email = $account_mail;
                // $user->password = bcrypt($this->default_password)    
                $user->password = bcrypt(substr($access_token, 0, 10));    
            }
            else
            {
                $user->password = bcrypt(substr($access_token, 0, 10)); 
            }
            
            $user->save();        
        }
        return response()->json([
            'isAuth' => $isAuthed,
        ], 200);
    }

    public function linkedinLogin(Request $request)
    {
        $code = $request->code;
        $urlToGetLinkedInAccessToken = "https://www.linkedin.com/oauth/v2/accessToken";
        $LINKEDIN_CLIENT_ID = 'XXXXXXXXXX';
        $LINKEDIN_CLIENT_SECRET = 'XXXXXXXX';
        $LINKEDIN_REDIRECT_URI = 'http://localhost:3000';
        $LINKEDIN_SCOPE = 'r_liteprofile%20r_emailaddress';
        $LINKEDIN_STATE = '123456'; 

        // getting accessToken from code
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $urlToGetLinkedInAccessToken);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS,
            "grant_type=authorization_code&code=$code&redirect_uri=$LINKEDIN_REDIRECT_URI&client_id=$LINKEDIN_CLIENT_ID&client_secret=$LINKEDIN_CLIENT_SECRET");
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $output = curl_exec($ch);
        curl_close ($ch);

        $access_token = json_decode($output)->access_token;
        if (is_null($access_token))
        {
            return response()->json([
                'isAuth' => false,
            ]);
        }

        $urlToGetUserEmail = 'https://api.linkedin.com/v2/clientAwareMemberHandles?q=members&projection=(elements*(primary,type,handle~))';
        
        $curl = curl_init();
        curl_setopt($curl, CURLOPT_URL, $urlToGetUserEmail);
        curl_setopt($curl, CURLOPT_HTTPHEADER, array(
            "Authorization: Bearer $accessToken"
        ));
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
        $output = curl_exec($curl);

        $account_mail = json_decode($output)[0]->handle;

        curl_close($curl);

        $isAuthed = false;
        if (filter_var($account_mail, FILTER_VALIDATE_EMAIL)) {

            $user = User::where('email', $account_mail)->first();
            if (!is_null($user))
            {
                if (! $token = auth()->attempt(['email' => $account_mail, 'password' => substr($access_token, 0, 10)])) {
                    return response()->json([
                        'message' => '入力されたパスワードが正しくありません。',
                    ], 401);
                }
                
                auth()->user()->roles;
                $isAuthed = true;
                return response()->json([
                    'access_token' => $token,
                    'token_type' => 'bearer',
                    'expires_in' => auth()->factory()->getTTL() * 60000,
                    'user' => auth()->user(),
                    'isAuth' => $isAuthed        
                ]);
            }
        }

        return response()->json([
            'isAuth' => $isAuthed,
        ]);
    }
}
