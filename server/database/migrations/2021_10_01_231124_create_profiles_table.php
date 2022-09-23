<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateProfilesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onUpdate('cascade')->onDelete('cascade');
            $table->string('birthday');
            $table->string('birthplace');
            $table->enum('blood', ['O', 'A', 'B', 'AB'])->default('O');
            $table->string('language');
            $table->string('character');
            $table->string('play');
            
            $table->string('job');
            $table->string('income');
            $table->string('education');
            $table->string('living');
            $table->string('faith');
            $table->string('meal');
            $table->string('interest');
            
            $table->string('introduction');

            $table->string('avatar');
            // $table->string('');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('profiles');
    }
}
