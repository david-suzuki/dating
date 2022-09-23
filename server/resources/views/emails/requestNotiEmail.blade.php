@component('mail::message', ['msg' => $msg])
# Hi, there.

We have some news for you with request order.

{{$msg}}

@component('mail::button', ['url' => config('app.url')])
Visit
@endcomponent

Thanks,<br>
{{ config('app.name') }}
@endcomponent
