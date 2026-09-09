<?php
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
$path = __DIR__ . '/../data/config.json';
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (!file_exists($path)) { http_response_code(404); echo json_encode(['error'=>'config_not_found']); exit; }
    readfile($path); exit;
}
if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); echo json_encode(['error'=>'method_not_allowed']); exit; }
$raw = file_get_contents('php://input');
$data = json_decode($raw, true);
if (!is_array($data) || !isset($data['screens'],$data['playlists'],$data['media'])) { http_response_code(400); echo json_encode(['error'=>'invalid_config']); exit; }
$json = json_encode($data, JSON_PRETTY_PRINT|JSON_UNESCAPED_SLASHES|JSON_UNESCAPED_UNICODE);
$tmp = $path . '.tmp';
$fp = fopen($tmp, 'c');
if (!$fp) { http_response_code(500); echo json_encode(['error'=>'write_failed']); exit; }
flock($fp, LOCK_EX); ftruncate($fp, 0); fwrite($fp, $json); fflush($fp); flock($fp, LOCK_UN); fclose($fp);
if (!rename($tmp, $path)) { @unlink($tmp); http_response_code(500); echo json_encode(['error'=>'replace_failed']); exit; }
echo json_encode(['ok'=>true]);