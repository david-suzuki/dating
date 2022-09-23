@component('mail::message', ['url' => $url])
# Hi, there

You've updated your email.

Click verify button to update your email.

@component('mail::button', ['url' => $url])
Verify
@endcomponent

Thanks,<br>
{{ config('app.name') }}
@endcomponent
