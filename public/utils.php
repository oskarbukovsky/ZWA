<?php

function newUuid()
{
    return file_get_contents('/proc/sys/kernel/random/uuid');
}

function br()
{
    echo "\n";
}