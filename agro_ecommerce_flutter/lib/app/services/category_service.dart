
import 'dart:convert';

import 'package:agro_ecommerce_flutter/app/models/Category.dart';
import 'package:agro_ecommerce_flutter/app/utils/http_util.dart';

import '../models/SubCategory.dart';

class CategoryService {

  Future<List<Category>> fetchCategories() async {
    try {
      final response = await HttpHelper.get("categories");

      if (response.containsKey('data')) {
        List<dynamic> data = response['data'];

        return data.map((categoryJson) {
          if (categoryJson is Map<String, dynamic>) {
            return Category.fromJson(categoryJson);
          } else {
            throw Exception("Category JSON is not of type Map<String, dynamic>");
          }
        }).toList();
      } else {
        print("No categories found in response.");
        return [];
      }
    } catch (e) {
      print("Error fetching categories: $e");
      return [];
    }
  }

  Future<List<SubCategory>> fetchSubCategories() async {
    try {
      final response = await HttpHelper.get("subcategories");

      if (response.containsKey('data')) {
        List<dynamic> data = response['data'];

        return data.map((subcategoryJson) {
          if (subcategoryJson is Map<String, dynamic>) {
            return SubCategory.fromJson(subcategoryJson);
          } else {
            throw Exception("Category JSON is not of type Map<String, dynamic>");
          }
        }).toList();
      } else {
        print("No subcategories found in response.");
        return [];
      }
    } catch (e) {
      print("Error fetching subcategories: $e");
      return [];
    }
  }
}
