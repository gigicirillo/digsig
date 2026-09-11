<?php
$allowedOrigins = [
    'https://tv.lynca.it',
    'https://gigicirillo.github.io'
];

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin && in_array($origin, $allowedOrigins, true)) {
    header('Access-Control-Allow-Origin: ' . $origin);
    header('Vary: Origin');
}

header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('X-Content-Type-Options: nosniff');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($origin && !in_array($origin, $allowedOrigins, true)) {
    http_response_code(403);
    echo json_encode(['error' => 'origin_not_allowed']);
    exit;
}

$dataDir = __DIR__ . '/data';
$path = $dataDir . '/config.json';

if (!is_dir($dataDir) && !mkdir($dataDir, 0755, true)) {
    http_response_code(500);
    echo json_encode(['error' => 'data_directory_unavailable']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (!file_exists($path)) {
        http_response_code(404);
        echo json_encode(['error' => 'config_not_found']);
        exit;
    }
    readfile($path);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'method_not_allowed']);
    exit;
}

$raw = file_get_contents('php://input');
$data = json_decode($raw, true);

if (!is_array($data) || !isset($data['screens'], $data['playlists'], $data['media']) ||
    !is_array($data['screens']) || !is_array($data['playlists']) || !is_array($data['media'])) {
    http_response_code(400);
    echo json_encode(['error' => 'invalid_config']);
    exit;
}

if (!isset($data['widgets']) || !is_array($data['widgets'])) {
    $data['widgets'] = [];
}
if (!isset($data['designs']) || !is_array($data['designs'])) {
    $data['designs'] = [];
}

$json = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
if ($json === false) {
    http_response_code(500);
    echo json_encode(['error' => 'encode_failed']);
    exit;
}

$tmp = $path . '.tmp';
$fp = fopen($tmp, 'c');
if (!$fp) {
    http_response_code(500);
    echo json_encode(['error' => 'write_failed']);
    exit;
}

if (!flock($fp, LOCK_EX)) {
    fclose($fp);
    @unlink($tmp);
    http_response_code(500);
    echo json_encode(['error' => 'lock_failed']);
    exit;
}

ftruncate($fp, 0);
$written = fwrite($fp, $json);
fflush($fp);
flock($fp, LOCK_UN);
fclose($fp);

if ($written === false || !rename($tmp, $path)) {
    @unlink($tmp);
    http_response_code(500);
    echo json_encode(['error' => 'replace_failed']);
    exit;
}

echo json_encode(['ok' => true]);
