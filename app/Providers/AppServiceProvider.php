<?php

namespace App\Providers;

use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Pagination\Paginator;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Request;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        $this->app->resolving(Paginator::class, function ($paginator) {
            return $paginator->appends(Arr::except(Request::query(), $paginator->getPageName()));
        });
        $this->app->resolving(LengthAwarePaginator::class, function ($paginator) {
            return $paginator->appends(Arr::except(Request::query(), $paginator->getPageName()));
        });
    }
}
