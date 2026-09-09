<?php
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'method_not_allowed']);
    exit;
}

if (!isset($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
    http_response_code(400);
    echo json_encode(['error' => 'missing_file']);
    exit;
}

$file = $_FILES['file'];
$maxBytes = 120 * 1024 * 1024;
if ($file['size'] > $maxBytes) {
    http_response_code(413);
    echo json_encode(['error' => 'file_too_large']);
    exit;
}

$finfo = new finfo(FILEINFO_MIME_TYPE);
$mime = $finfo->file($file['tmp_name']);
$allowed = [
    'image/jpeg' => 'jpg',
    'image/png' => 'png',
    'image/webp' => 'webp',
    'image/gif' => 'gif',
    'video/mp4' => 'mp4',
    'video/webm' => 'webm'
];
if (!isset($allowed[$mime])) {
    http_response_code(415);
    echo json_encode(['error' => 'unsupported_type']);
    exit;
}

$dir = dirname(__DIR__) . '/media';
if (!is_dir($dir) && !mkdir($dir, 0775, true)) {
    http_response_code(500);
    echo json_encode(['error' => 'cannot_create_media_dir']);
    exit;
}

$base = pathinfo($file['name'], PATHINFO_FILENAME);
$base = preg_replace('/[^a-zA-Z0-9_-]+/', '-', $base);
$base = trim($base, '-_');
if ($base === '') $base = 'media';
$name = strtolower($base) . '-' . date('Ymd-His') . '-' . bin2hex(random_bytes(3)) . '.' . $allowed[$mime];
$target = $dir . '/' . $name;

if (!move_uploaded_file($file['tmp_name'], $target)) {
    http_response_code(500);
    echo json_encode(['error' => 'upload_failed']);
    exit;
}

echo json_encode([
    'ok' => true,
    'name' => $name,
    'url' => 'media/' . $name,
    'mime' => $mime,
    'size' => filesize($target)
], JSON_UNESCAPED_SLASHES);
