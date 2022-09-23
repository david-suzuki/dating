<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Profile extends Model
{
    use HasFactory;

    public $table = "profiles";

    protected $fillable = [
        'user_id',
        'name',
        'birthday',
        'birthplace',
        'language',
        'character',
        'play',
        
        'job',
        'income',
        'education',
        'living',
        'faith',
        'meal',
        'interest',
        
        'introduction',        
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
