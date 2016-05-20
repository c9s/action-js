<?php
require __DIR__ . '/vendor/autoload.php';

use ActionKit\ActionRunner;
use ActionKit\ActionRequest;
use ActionKit\ServiceContainer;
use ActionKit\ActionTemplate\TwigActionTemplate;
use ActionKit\ActionTemplate\CodeGenActionTemplate;
use ActionKit\ActionTemplate\RecordActionTemplate;
use ActionKit\ActionTemplate\UpdateOrderingRecordActionTemplate;

$container = new ServiceContainer;
$generator = $container['generator'];

// Register Twig-based action template
$generator->registerTemplate('TwigActionTemplate', new TwigActionTemplate);

// Register Codegen-based action template
$generator->registerTemplate('CodeGenActionTemplate', new CodeGenActionTemplate);

// Register RecordAction template for LazyRecord
$generator->registerTemplate('RecordActionTemplate', new RecordActionTemplate);

// Action template for updating record ordering field
$generator->registerTemplate('UpdateOrderingRecordActionTemplate', new UpdateOrderingRecordActionTemplate);

$runner = new ActionRunner($container);
$runner->registerAutoloader();

if (!ActionRequest::hasAction($_REQUEST)) {
    header('HTTP/1.1 403 Forbidden');
    echo json_encode(['error' => 'no action defined']);
    exit(0);
}
$output = fopen("php://output", "w");
if ($result = $runner->handleWith($output, $_REQUEST, $_FILES)) {
    exit(0);
}
