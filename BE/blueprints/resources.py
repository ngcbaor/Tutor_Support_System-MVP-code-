import os
import json
from flask import Blueprint, jsonify, request, abort, send_from_directory

resources_app = Blueprint("resources_routes", __name__)

with open('./data/resources.json', 'r') as f:
    data = json.load(f)

USERS = {u['id']: u for u in data['users']}
CLASSES = {c['code']: c for c in data['classes']}
RESOURCES = data['resources']
ENROLLMENTS = data['enrollments']
BOOKMARKS = data['bookmarks']

def get_current_user_id():
    return "user_123"

@resources_app.route('/classes', methods=['GET'])
def get_my_classes():
    user_id = get_current_user_id()
    
    my_class_codes = [e['class_code'] for e in ENROLLMENTS if e['user_id'] == user_id]
    
    response_data = []
    
    for code in my_class_codes:
        class_info = CLASSES.get(code)
        if not class_info:
            continue
            
        resource_count = len([r for r in RESOURCES if r['class_code'] == code])
        
        response_data.append({
            "code": class_info['code'],
            "name": class_info['name'],
            "item_count": resource_count
        })
        
    return jsonify(response_data)


@resources_app.route('/classes/<string:class_code>/resources', methods=['GET'])
def get_class_resources(class_code: str):
    user_id = get_current_user_id()
    
    is_enrolled = any(e for e in ENROLLMENTS if e['user_id'] == user_id and e['class_code'] == class_code)
    if not is_enrolled:
        return jsonify({"error": "Unauthorized access"}), 403

    class_resources = [r for r in RESOURCES if r['class_code'] == class_code]
    
    return jsonify(class_resources)


@resources_app.route('/bookmarks', methods=['GET'])
def get_my_bookmarks():
    user_id = get_current_user_id()
    
    my_bookmarks = [b for b in BOOKMARKS if b['user_id'] == user_id]
    response_data = []
    
    for bm in my_bookmarks:
        resource = next((r for r in RESOURCES if r['id'] == bm['resource_id']), None)
        if resource:
            entry = resource.copy()
            entry['bookmarked_at'] = bm['createdAt']
            response_data.append(entry)
            
    return jsonify(response_data)


@resources_app.route('/data/resources/<path:filename>', methods=['GET'])
def serve_resource_file(filename):
    resources_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data', 'resources')
    
    if '..' in filename or filename.startswith('/'):
        abort(400, 'Invalid filename')
    
    file_path = os.path.join(resources_dir, filename)
    if not os.path.exists(file_path):
        abort(404, 'File not found')
    
    ext = os.path.splitext(filename)[1].lower()
    mimetype_map = {
        '.pdf': 'application/pdf',
        '.zip': 'application/zip',
        '.jsx': 'text/plain',
        '.js': 'text/plain',
        '.py': 'text/plain',
        '.java': 'text/plain',
        '.cpp': 'text/plain',
        '.txt': 'text/plain',
        '.md': 'text/markdown',
    }
    mimetype = mimetype_map.get(ext, 'application/octet-stream')
    
    return send_from_directory(resources_dir, filename, mimetype=mimetype)