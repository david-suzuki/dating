<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use App\Models\Role;
use App\Models\Price;
use App\Models\Work;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Validator;

class PriceController extends Controller
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
    public function index()
    {
        $prices = Price::all();
        foreach ($prices as $price) {
            $price->work;
        }
        return response()->json([
            'message' => 'success',
            'prices' => $prices
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
            'work_id' => 'required',
            'main_amount' => 'required',
            'main_period' => 'required',
        ]);

        $price = Price::where('work_id', $request->work_id)->first();
        $price -> update([
            'main_amount' => $request->main_amount,
            'add_amount' => $request->add_amount,
            'main_period' => $request->main_period,
            'add_period' => $request->add_period,
        ]);
        // 簡易図化
        if ($request->work_id == 2) {
            $price = Price::where('work_id', 2)->skip(1)->first();
            $price -> update([
                'main_amount' => $request->rank_amount_a,
                'add_amount' => $request->level_amount_a,
            ]);
            $price = Price::where('work_id', 2)->skip(2)->first();
            $price -> update([
                'main_amount' => $request->rank_amount_b,
                'add_amount' => $request->level_amount_b,
            ]);
            $price = Price::where('work_id', 2)->skip(3)->first();
            $price -> update([
                'main_amount' => $request->rank_amount_c,
            ]);
        }

        return response()->json([
            'message' => 'success',
            'price' => $price,
        ], 200);
    }

    public function updateDrawing(Request $request)
    {
        // Update user
        $request->validate([
            'work_id' => 'required',
            'main_amount' => 'required',
            'main_period' => 'required',
        ]);

        $price = Price::where('work_id', $request->work_id)->first();
        $price -> update([
            'main_amount' => $request->main_amount,
            'add_amount' => $request->add_amount,
            'main_period' => $request->main_period,
            'add_period' => $request->add_period,
        ]);

        return response()->json([
            'message' => 'success',
            'price' => $price,
        ], 200);
    }
}
