@component('mail::message', ['msg' => $msg])
# Hi, there.

We miss you. You haven't logged in our platform for about 48 hours.

We have some news for you.

{{$msg}}

@component('mail::button', ['url' => config('app.url')])
    Visit
@endcomponent

Thanks,<br>
{{ config('app.name') }}
@endcomponent
