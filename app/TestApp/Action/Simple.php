<?php
namespace TestApp\Action;

use ActionKit\Action;

class Simple extends Action
{
    public function run()
    {
        return $this->success('OK!');
    }
}




