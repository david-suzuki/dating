<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class OrderNotiEmail extends Mailable
{
    use Queueable, SerializesModels;

    public $username;
    public $company;
    public $project;
    public $url;
    public $title;
    public $file;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->subject($this->title)->markdown('emails.orderNoti')
            ->attachFromStorageDisk('s3', $this->file);
    }
}
