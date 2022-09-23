<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\PriceController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\ChatController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/


/* Contact */
Route::post('/contact', [ContactController::class, 'store']);
/* process unread chat message */
Route::post('/notifyChat', [ContactController::class, 'notifyChat']); 

Route::group(['middleware' => 'api'], function(){
    /* User register */
    Route::post('/register', [AuthController::class, 'register']);
    /* User login */
    Route::post('/login', [AuthController::class, 'login'])->name('login');

    /* Socail auth*/
    // Route::post('/login/{social}/callback','Auth\LoginController@handleProviderCallback')->where('social','twitter|facebook|linkedin|google|graph');
    // Route::get('/auth/login/{social}', [AuthController::class, 'socialLogin'])->where('social','twitter|facebook|linkedin|google|graph');

    // Route::post('/authenticate/{social}', [AuthController::class, 'socialAuth'])->where('social','facebook|linkedin|google');
    Route::post('/signup/google', [AuthController::class, 'googleRegister']);  
    Route::post('/signin/google', [AuthController::class, 'googleLogin']);

    Route::post('/signup/facebook', [AuthController::class, 'facebookRegister']);  
    Route::post('/signin/facebook', [AuthController::class, 'facebookLogin']); 

    Route::post('/signup/linkedin', [AuthController::class, 'linkedinRegister']);  
    Route::post('/signin/linkedin', [AuthController::class, 'linkedinLogin']);   


    /* Reset password */
    Route::post('/reset/password', [AuthController::class, 'resetPassword']);

    /* Refresh user's token */
    Route::get('/refresh', [AuthController::class, 'token']);
    /* User logout from system */
    Route::get('/logout', [AuthController::class, 'logout']);
    // Get auth user
    Route::get('/token/validate', [AuthController::class, 'auth']);

    // Get user's profile
    Route::get('/profiles', [ProfileController::class, 'index']);
    // Get search users list
    Route::post('/profiles/search', [ProfileController::class, 'getSearch']);
    /* Get profile by id */
    Route::get('/profile/{id}', [ProfileController::class, 'getById']);
    /* Get profile by user */
    Route::get('/profile/get', [ProjectController::class, 'getMyProfile']);
    // Update user's profile
    Route::post('/profile/update', [ProfileController::class, 'update']);
    // Set user's like
    Route::get('/profile/like/{id}', [ProfileController::class, 'setLike']);
    // Set user's unlike
    Route::get('/profile/unlike/{id}', [ProfileController::class, 'setUnLike']);
    // Get user's approave list
    Route::get('/profile/approave/{id}', [ProfileController::class, 'getApproaves']);
    // Get user's approave list
    Route::post('/profile/set_approave', [ProfileController::class, 'setApproaves']);

    // Route::put('/profile/company', [ProfileController::class, 'updateCompany']);
    // Route::put('/profile/name', [ProfileController::class, 'updateName']);
    // Route::put('/profile/phone', [ProfileController::class, 'updatePhone']);
    // Route::put('/profile/mail', [ProfileController::class, 'updateMail']);
    // Route::put('/profile/passwd', [ProfileController::class, 'updatePasswd']);

    // Get all projects
    Route::get('/projects', [ProjectController::class, 'getAll']);
    /* Get project detail by id */
    Route::get('/project/{projectId}', [ProjectController::class, 'getById']);
    /* Update project's status */
    Route::put('/project/set-status', [ProjectController::class, 'setStatus']);

    // Download order document
    // Route::get('/project/order/download/{projectId}', [ProjectController::class, 'downloadOrder']);
    // Route::get('/project/invoice/download/{projectId}', [ProjectController::class, 'downloadInvoice']);

    // Route::get('/project/request/get/{projectId}', [ProjectController::class, 'getRequestData']);
    // Route::get('/project/delivery/get/{projectId}', [ProjectController::class, 'getDeliveryData']);
    // Route::get('/project/request/download/{dataId}', [ProjectController::class, 'downloadRequestData']);
    // Route::get('/project/delivery/download/{dataId}', [ProjectController::class, 'downloadDeliveryData']);
    /* Add a new request data */
    // Route::post('/project/request/add/{projectId}', [ProjectController::class, 'addRequestData']);
    /* Add a new deliverable data */
    // Route::post('/project/delivery/add/{projectId}', [ProjectController::class, 'addDeliveryData']);

    // Get all projects
    // Route::get('/work/formats', [ProjectController::class, 'getWorkFormats']);

    Route::get('/chat/list/{id}', [ChatController::class, 'list']);
    Route::post('/chat/search', [ChatController::class, 'search']);
    Route::get('/chat/unread_num/{id}', [ChatController::class, 'getUnreadNum']);

    // Mark chat message as read
    Route::get('/markChatMessage/{projectId}', [ContactController::class, 'markChatMessage']);
    Route::get('/markChatMessageProject/{projectId}', [ContactController::class, 'markChatMessageProject']);

    //Admin actions
    Route::group([ 'prefix' => 'admin'], function(){
        /* Get all users details*/
        Route::get('/users', [UserController::class, 'getAll']);
        /* Add a user */
        Route::post('/user/create', [UserController::class, 'create']);
        /* Update a user */
        Route::put('/user/update', [UserController::class, 'update']);
        /* Update a user status*/
        Route::post('/user/status', [UserController::class, 'status']);
        /* Get user detail by id */
        Route::get('/user/{userId}', [UserController::class, 'getById']);
        /* delete user by id */
        Route::delete('/user/delete/{id}', [UserController::class, 'delete']);

        /* Get all businesses*/
        Route::get('/businesses', [UserController::class, 'getAllBusinesses']);
        /* Get price list*/
        // Route::get('/prices', [PriceController::class, 'index']);
        /* Update price list */
        // Route::put('/price/update', [PriceController::class, 'update']);

        // Assign project to a business
        // Route::put('/project/assign', [ProjectController::class, 'assignProject']);
        // // delete project by id
        // Route::delete('/project/{projectId}/delete', [ProjectController::class, 'delete']);
        // // delete request data
        // Route::delete('/project/request/delete/{dataId}', [ProjectController::class, 'deleteRequestData']);
        // // delete deliverable data
        // Route::delete('/project/delivery/delete/{dataId}', [ProjectController::class, 'deleteDeliveryData']);
    });

    //Client actions
    Route::group([ 'prefix' => 'client', 'middleware' => 'isClient' ], function(){
        /* Create a new project */
        // Route::post('/project/create', [ProjectController::class, 'create']);
        // /* Update a project detail */
        // Route::put('/project/update', [ProjectController::class, 'update']);
        /* Get price list*/
        Route::get('/prices', [PriceController::class, 'index']);
    });

    //Business actions
    Route::group([ 'prefix' => 'business', 'middleware' => 'isBusiness' ], function(){
    });
});
