import 'package:flutter/material.dart';

class CustomCheckboxTheme {
  static CheckboxThemeData lightCheckboxTheme = CheckboxThemeData(
    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(4)),
    checkColor: MaterialStateProperty.resolveWith((states){
      if(states.contains(MaterialState.selected)){
        return Colors.white;
      }else{
        return Colors.black;
      }
    }),
    fillColor: MaterialStateProperty.resolveWith((states){
      if(states.contains(MaterialState.selected)){
        return Colors.green;
      }else{
        return Colors.transparent;
      }
    }),
  );

  static CheckboxThemeData darkCheckboxTheme = CheckboxThemeData(
    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(4)),
    checkColor: MaterialStateProperty.resolveWith((states){
      if(states.contains(MaterialState.selected)){
        return Colors.white;
      }else{
        return Colors.black;
      }
    }),
    fillColor: MaterialStateProperty.resolveWith((states){
      if(states.contains(MaterialState.selected)){
        return Colors.green;
      }else{
        return Colors.transparent;
      }
    }),
  );
}