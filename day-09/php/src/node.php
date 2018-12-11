<?php 

class Node
{
    public function __construct($data)
    {
        $this->data = $data;
        $this->next = $this;
        $this->prev = $this;
    }

    public function getPrev($steps)
    {
        $node = $this;
        for ($i = 1; $i <= $steps; $i++) $node = $node->prev;
        return $node;
    }

    public function addNext($node)
    {
        $this->next->prev = $node;
        $node->next = $this->next;
        $node->prev = $this;
        $this->next = $node;
    }

    public function remove()
    {
        $prev = $this->prev;
        $next = $this->next;
        $prev->next = $next;
        $next->prev = $prev;
        $this->next = null;
        $this->prev = null;
        return $this;
    }
}
