<?php
namespace TestApp\Action;

use ActionKit\Action;

class Error extends Action
{
    public function run()
    {
        return $this->error('Error!', [ 'foo' => 1, ]);
    }
}


