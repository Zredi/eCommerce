import 'dart:typed_data';

class ImageModel {
  final int id;
  final String fileName;
  final String downloadUrl;

  ImageModel({
    required this.id,
    required this.fileName,
    required this.downloadUrl,
  });

  factory ImageModel.fromJson(Map<String, dynamic> json) {
    return ImageModel(
      id: json['id'],
      fileName: json['fileName'],
      downloadUrl: json['downloadUrl'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'fileName': fileName,
      'downloadUrl': downloadUrl,
    };
  }
}
