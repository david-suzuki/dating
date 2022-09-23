@component('mail::message', ['msg' => $msg])
    # Hi, there.

    We have some news for your withdraw requests.

    {{$msg}}

    @component('mail::button', ['url' => config('app.url')])
        Visit
    @endcomponent

    Thanks,<br>
    {{ config('app.name') }}
@endcomponent
