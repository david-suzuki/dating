<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use App\Models\Role;
use App\Models\Project;
use App\Models\ProjectDetail;
use App\Models\RequestData;
use App\Models\DeliverableData;
use App\Models\Work;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Http\Controllers\Controller;
use Validator;

use App\Mail\OrderNotiEmail;
use App\Mail\AssignNotiEmail;
use App\Mail\StartNotiEmail;
use App\Mail\DeliveryNotiEmail;
use App\Mail\ConfirmNotiEmail;
use App\Mail\FinishNotiEmail;
use Illuminate\Support\Facades\Mail;

use Carbon\Carbon;
use PDF;

class ProjectController extends Controller
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
        $user = auth('api')->user();
        $role = $user->roles->first();
        
        if ($role->name == 'Client')
            $projects = Project::where('client_id', $user->id)->get();
        else if ($role->name == 'Business')
            $projects = Project::where('business_id', $user->id)->get();
        else
            $projects = Project::all();

        foreach ($projects as $key => $project) {
            if ($project->client != null)
                $project->company = $project->client->company;
            $project->created_date = $project->created_at->format('Y-m-d');
        }

        return response()->json([
            'message' => 'success',
            'projects' => $projects,
            'user' => $user
        ], 200);
    }

    /**
     * Response one data by id
     * 
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function getById($projectId)
    {
        $project = Project::find($projectId);
        $project->client;
        $project->business;
        $project->detail;
        $project->requestData;
        $project->deliverableData;

        return response()->json([
            'message' => 'success',
            'project' => $project,
        ], 200);
    }

    public function getWorkFormats(Request $request) {
        $works = Work::all();
        foreach ($works as $work) {
            $work->outputFormats;
        }

        return response()->json([
            'message' => 'success',
            'work_output_formats' => $works,
        ], 200);
    }

    /**
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function create(Request $request) {
        $validator = Validator::make($request->all(), [
            'client_id' => 'required',
            'title' => 'required|string',
            'delivery_date' => 'required',
        ]);

        if($validator->fails()){
            return response()->json($validator->errors()->toJson(), 400);
        }
        
        $project = new Project;
        $project->admin_id = 1;
        $project->client_id = $request->client_id;
        $project->title = $request->title;
        $project->amount = $request->amount;
        $project->tax = $request->tax;
        $project->delivery_date = $request->delivery_date;
        $project->status = '作業前';
        $project->save();

        $project->detail()->create([
            'ground_data' => $request->ground_data,
            'ground_data_output' => $request->ground_data_output,
            'ground_price' => $request->ground_price,
            'simplified_drawing' => $request->simplified_drawing,
            'simplified_drawing_output' => $request->simplified_drawing_output,
            'simplified_drawing_rank' => $request->simplified_drawing_rank,
            'simplified_drawing_scale' => $request->simplified_drawing_scale,
            'simplified_drawing_price' => $request->simplified_drawing_price,
            'contour_data' => $request->contour_data,
            'contour_data_output' => $request->contour_data_output,
            'contour_price' => $request->contour_price,
            'longitudinal_data' => $request->longitudinal_data,
            'longitudinal_data_output' => $request->longitudinal_data_output,
            'longitudinal_price' => $request->longitudinal_price,
            'simple_orthphoto' => $request->simple_orthphoto,
            'simple_orthphoto_output' => $request->simple_orthphoto_output,
            'simple_orthphoto_price' => $request->simple_orthphoto_price,
            'mesh_soil_volume' => $request->mesh_soil_volume,
            'mesh_soil_volume_output' => $request->mesh_soil_volume_output,
            'mesh_soil_volume_price' => $request->mesh_soil_volume_price,
            'simple_accuracy_table' => $request->simple_accuracy_table,
            'simple_accuracy_table_output' => $request->simple_accuracy_table_output,
            'simple_accuracy_price' => $request->simple_accuracy_price,
            'public_accuracy_table' => $request->public_accuracy_table,
            'public_accuracy_table_output' => $request->public_accuracy_table_output,
            'public_accuracy_price' => $request->public_accuracy_price,
        ]);

        $project = Project::all()->last();

        $subdata = [
            [Work::find(1)->work, $request->ground_data, $request->ground_price],
            [Work::find(2)->work, $request->simplified_drawing, $request->simplified_drawing_price],
            [Work::find(3)->work, $request->contour_data, $request->contour_price],
            [Work::find(4)->work, $request->longitudinal_data, $request->longitudinal_price],
            [Work::find(5)->work, $request->simple_orthphoto, $request->simple_orthphoto_price],
            [Work::find(6)->work, $request->mesh_soil_volume, $request->mesh_soil_volume_price],
            [Work::find(7)->work, $request->simple_accuracy_table, $request->simple_accuracy_price],
            [Work::find(8)->work, $request->public_accuracy_table, $request->public_accuracy_price],
        ];
        $data = [
            'company' => $project->client->company,
            'person' => $project->client->name,
            'created_date' => Carbon::now()->format('Y-m-d'),
            'delivery_date' => $project->delivery_date->format('Y-m-d'),
            'no' => $project->id,
            'name' => $project->title,
            'amount' => $project->amount,
            'subamount' => $request->subamount,
            'tax' => $project->tax,
            'title' => $project->title.'_発注請書',
        ];
        $path = base_path('public/img/apex.png');
        $type = pathinfo($path, PATHINFO_EXTENSION);
        $img = file_get_contents($path);
        $imgdata = 'data:image/' . $type . ';base64,' . base64_encode($img);

        try {
            $pdf = PDF::loadView('export_pdf', compact('data', 'subdata', 'imgdata'));
            $fname = $project->id . '_order.pdf';
            Storage::disk('s3')->put($project->id . '/' . $fname, $pdf->output());
            // Storage::put('public/pdf/'.$fname, $pdf->output());
        } catch (Exception $e) {
            return response()->json([
                'message' => $e,
            ], 200);
        }
        $project->purchase_order_link = $fname;
        $project->save();

        $email = new OrderNotiEmail();
        $email->title = '案件作成完了のお知らせ[Simple-Point]';
        $email->company = $project->client->company;
        $email->username = $project->client->name;
        $email->project = $project->title;
        $email->url = 'http://simple-point.net/admin/projectdetail/' . $project->id;
        $email->file = $project->id . '/' . $fname;

        $admin = User::find(1);
        // Mail::to($project->client->email)->cc($admin->email)->send($email);
  
        return response()->json([
            'message' => 'success',
            'project' => $project
        ], 200);
    }
    
    public function update(Request $request)
    {
        
    }

    public function downloadOrder(Request $request, $projectId)
    {
        $user = auth('api')->user();
        $role = $user->roles->first();
        
        if ($role->name == 'Business')
            return response()->json([
                'message' => 'fail',
            ], 200);

        $project = Project::find($projectId);
        if ($project == null)
            return response()->json([
                'message' => 'fail',
            ], 200);
        
        $file_name  = "YOUR_DESIRED_NAME.pdf";

        $headers = [
                'Content-Type'        => 'application/pdf',            
                'Content-Disposition' => 'attachment; filename="'. $file_name .'"',
        ];            
        $filePath = $projectId . '/' . $project->purchase_order_link;
        return response()->make(Storage::disk('s3')->get($filePath), 200, $headers);        
        // $filePath = 'public/pdf/'. $project->purchase_order_link;
        // return response()->make(Storage::get($filePath), 200, $headers);
    }

    public function downloadInvoice(Request $request, $projectId)
    {
        $user = auth('api')->user();
        $role = $user->roles->first();
        if ($role->name == 'Business')
            return response()->json([
                'message' => 'fail',
            ], 200);
      
        $project = Project::find($projectId);
        if ($project == null)
            return response()->json([
                'message' => 'fail',
            ], 200);
        
        $file_name = "YOUR_DESIRED_NAME.pdf";

        $headers = [
                'Content-Type'        => 'application/pdf',            
                'Content-Disposition' => 'attachment; filename="'. $file_name .'"',
        ];            
        $filePath = $projectId . '/' . $project->invoice_link;
        return response()->make(Storage::disk('s3')->get($filePath), 200, $headers);
        // $filePath = 'public/pdf/'. $project->invoice_link;
        // return response()->make(Storage::get($filePath), 200, $headers);
    }

    public function getRequestData(Request $request, $projectId)
    {   
        $data = RequestData::where('project_id', $projectId)->get();

        return response()->json([
            'message' => 'success',
            'data' => $data,
            'id' => $projectId
        ], 200);
    }

    public function addRequestData(Request $request, $projectId)
    {
        $user = auth('api')->user();
        $role = $user->roles->first();
        
        if ($role->name == 'Business')
            return response()->json([
                'message' => 'fail',
            ], 200);

        $validator = Validator::make($request->all(), [
            'pdf' => 'required',
        ]);

        if($validator->fails()){
            return response()->json($validator->errors()->toJson(), 400);
        }

        $project = Project::find($projectId);
        if ($project == null)
            return response()->json([
                'message' => 'fail',
            ], 200);
        
        if ($request->hasFile('pdf')) {
            $file = $request->file('pdf');
        }
        else {
            return response()->json([
                'message' => 'fail',
            ], 200);            
        }
        // $name = $file->getClientOriginalName();
        try {
            // $name = time() . $file->getClientOriginalName();
            $name = $file->getClientOriginalName();
            $filePath = $projectId . '/' . $name;
            Storage::disk('s3')->put($filePath, file_get_contents($file));
        } catch (Exception $e) {
            return response()->json([
                'message' => $e,
            ], 200);
        }

        $request_data = new RequestData;
        $request_data->project_id = $projectId;
        $request_data->request_data_link = $name;
        $request_data->save();

        return response()->json([
            'message' => 'success',
            'request_data' => $request_data
        ], 200);
    }

    public function downloadRequestData(Request $request, $id)
    {
        $data = RequestData::find($id);

        if ($data == null)
            return response()->json([
                'message' => 'fail',
            ], 200);
        
        $file_name  = "YOUR_DESIRED_NAME.pdf";

        $headers = [
                'Content-Type'        => 'application/pdf',            
                'Content-Disposition' => 'attachment; filename="'. $file_name .'"',
        ];            
        $filePath = $data->project_id . '/' . $data->request_data_link;

        return response()->make(Storage::disk('s3')->get($filePath), 200, $headers);
    }

    public function deleteRequestData($dataId)
    {
        $request_data = RequestData::find($dataId);
        $projectId = $request_data->project_id;
        $request_data -> delete();

        $project = Project::find($projectId);

        return response()->json([
            'message' => 'success',
            'project' => $project,
        ], 200);
    }

    public function getDeliveryData(Request $request, $projectId)
    {   
        $data = DeliverableData::where('project_id', $projectId)->get();

        return response()->json([
            'message' => 'success',
            'data' => $data,
            'id' => $projectId
        ], 200);
    }

    public function addDeliveryData(Request $request, $projectId)
    {
        $user = auth('api')->user();
        $role = $user->roles->first();
        
        if ($role->name == 'Client')
            return response()->json([
                'message' => 'fail',
            ], 200);

        $validator = Validator::make($request->all(), [
            'pdf' => 'required',
        ]);

        if($validator->fails()){
            return response()->json($validator->errors()->toJson(), 400);
        }

        $project = Project::find($projectId);
        if ($project == null)
            return response()->json([
                'message' => 'fail',
            ], 200);
        
        if ($request->hasFile('pdf')) {
            $file = $request->file('pdf');
        }
        else {
            return response()->json([
                'message' => 'fail',
            ], 200);            
        }
        // $name = $file->getClientOriginalName();
        try {
            // $name = time() . $file->getClientOriginalName();
            $name = $file->getClientOriginalName();
            $filePath = $projectId . '/' . $name;
            Storage::disk('s3')->put($filePath, file_get_contents($file));
        } catch (Exception $e) {
            return response()->json([
                'message' => $e,
            ], 200);
        }

        $request_data = new DeliverableData;
        $request_data->project_id = $projectId;
        $request_data->deliverable_data_link = $name;
        $request_data->save();

        return response()->json([
            'message' => 'success',
            'request_data' => $request_data
        ], 200);
    }

    public function downloadDeliveryData(Request $request, $id)
    {
        $data = DeliverableData::find($id);

        if ($data == null)
            return response()->json([
                'message' => 'fail',
            ], 200);
        
        $file_name  = "YOUR_DESIRED_NAME.pdf";

        $headers = [
                'Content-Type'        => 'application/pdf',            
                'Content-Disposition' => 'attachment; filename="'. $file_name .'"',
        ];            
        $filePath = $data->project_id . '/' . $data->deliverable_data_link;

        return response()->make(Storage::disk('s3')->get($filePath), 200, $headers);
    }

    public function deleteDeliveryData($dataId)
    {
        //delete DeliverableData
        $deliverable_data = DeliverableData::find($dataId);
        $projectId = $deliverable_data->project_id;
        $deliverable_data -> delete();

        $project = Project::find($projectId);

        return response()->json([
            'message' => 'success',
            'project' => $project,
        ], 200);
    }

    public function assignProject(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'project_id' => 'required',
            'business_id' => 'required',
        ]);

        if($validator->fails()){
            return response()->json($validator->errors()->toJson(), 400);
        }

        $project = Project::find($request->project_id);
        $project->business_id = $request->business_id;
        $project->save();

        $email = new AssignNotiEmail();
        $email->title = '作業依頼のお知らせ[Simple-Point]';
        $email->company = $project->business->company;
        $email->username = $project->business->name;
        $email->project = $project->title;
        $email->url = 'http://simple-point.net/admin/projectdetail/' . $project->id;
        // Mail::to($project->business->email)->send($email);
        
        return response()->json([
            'message' => 'success',
            'project' => $project
        ], 200);
    }

    public function setStatus(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'project_id' => 'required',
            'status' => 'required',
        ]);

        if($validator->fails()){
            return response()->json($validator->errors()->toJson(), 400);
        }

        $project = Project::find($request->project_id);
        $project->status = $request->status;
        $project->save();

        if ($request->status == '作業中') {
            $email = new StartNotiEmail();
            $email->title = '作業開始のお知らせ[Simple-Point]';
            $email->account = $project->business->name;
            $email->project = $project->title;
            $email->url = 'http://simple-point.net/admin/projectdetail/' . $project->id;

            $admin = User::find(1);
            // Mail::to($admin->email)->send($email);
        }
        else if ($request->status == '納品中') {
            $email = new DeliveryNotiEmail();
            $email->title = '納品申請のお知らせ[Simple-Point]';
            $email->account = $project->business->name;
            $email->project = $project->title;
            $email->url = 'http://simple-point.net/admin/projectdetail/' . $project->id;

            $admin = User::find(1);
            // Mail::to($admin->email)->send($email);
        }
        else if ($request->status == '検収中') {
            $email = new ConfirmNotiEmail();
            $email->title = '検収リクエストのお知らせ[Simple-Point]';
            $email->company = $project->client->company;
            $email->username = $project->client->name;
            $email->project = $project->title;
            $email->url = 'http://simple-point.net/admin/projectdetail/' . $project->id;
            // Mail::to($project->client->email)->send($email);
        }
        else if ($request->status == '完了') {
            $detail = $project->detail;
            $subdata = [
                [Work::find(1)->work, $detail->ground_data, $detail->ground_price],
                [Work::find(2)->work, $detail->simplified_drawing, $detail->simplified_drawing_price],
                [Work::find(3)->work, $detail->contour_data, $detail->contour_price],
                [Work::find(4)->work, $detail->longitudinal_data, $detail->longitudinal_price],
                [Work::find(5)->work, $detail->simple_orthphoto, $detail->simple_orthphoto_price],
                [Work::find(6)->work, $detail->mesh_soil_volume, $detail->mesh_soil_volume_price],
                [Work::find(7)->work, $detail->simple_accuracy_table, $detail->simple_accuracy_price],
                [Work::find(8)->work, $detail->public_accuracy_table, $detail->public_accuracy_price],                
            ];

            $data = [
                'company' => $project->client->company,
                'person' => $project->client->name,
                'created_date' => Carbon::now()->format('Y-m-d'),
                'payment_date' => Carbon::now()->addMonthsNoOverflow(1)->endOfMonth()->format('Y-m-d'),
                'no' => $project->id,
                'name' => $project->title,
                'amount' => $project->amount,
                'subamount' => $project->amount - $project->tax,
                'tax' => $project->tax,
                'title' => $project->title.'_請求書',
            ];
            $path = base_path('public/img/apex.png');
            $type = pathinfo($path, PATHINFO_EXTENSION);
            $img = file_get_contents($path);
            $imgdata = 'data:image/' . $type . ';base64,' . base64_encode($img);

            try {
                $pdf = PDF::loadView('export_invoice_pdf', compact('data', 'subdata', 'imgdata'));
                $fname = $project->id . '_invoice.pdf';
                Storage::disk('s3')->put($project->id . '/' . $fname, $pdf->output());
                // Storage::put('public/pdf/'.$fname, $pdf->output());
            } catch (Exception $e) {
                return response()->json([
                    'message' => $e,
                ], 200);
            }

            $project->invoice_link = $fname;
            $project->save();
 
            $email = new FinishNotiEmail();
            $email->title = '検収完了のお知らせ[Simple-Point]';
            $email->company = $project->client->company;
            $email->username = $project->client->name;
            $email->project = $project->title;
            $email->url = 'http://simple-point.net/admin/projectdetail/' . $project->id;
            $email->file = $project->id . '/' . $fname;

            $admin = User::find(1);
            // Mail::to($project->client->email)->cc($admin->email)->send($email);
        }

        return response()->json([
            'message' => 'success',
            'project' => $project
        ], 200);
    }

    public function delete($projectId)
    {
        //delete Project
        $project = Project::find($projectId);
        $project -> delete();

        $projects = Project::all();
        foreach ($projects as $project) {
            $project->client;
            $project->business;
            // $project->detail;
            // $project->requestData;
            // $project->deliverableData;
        }

        return response()->json([
            'message' => 'success',
            'projects' => $projects
        ], 200);
    }
}
