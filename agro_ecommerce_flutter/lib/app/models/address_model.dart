
class AddressModel{
  int? id;
  final String name;
  final String phoneNo;
  final String street;
  final String city;
  final String state;
  final String zipCode;
  final String country;

  AddressModel({
    this.id,
    required this.name,
    required this.phoneNo,
    required this.street,
    required this.city,
    required this.state,
    required this.zipCode,
    required this.country,
  });

  static AddressModel empty() => AddressModel(street: '', city: '', state: '', zipCode: '', country: '', name: '', phoneNo: '',);

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'phoneNo': phoneNo,
      'street': street,
      'city': city,
      'state': state,
      'zipCode': zipCode,
      'country': country,
    };
  }

  factory AddressModel.fromJson(Map<String, dynamic> json) {
    return AddressModel(
      id: json['id'],
      name: json['name'],
      phoneNo: json['phoneNo'],
      street: json['street'],
      city: json['city'],
      state: json['state'],
      zipCode: json['zipCode'],
      country: json['country'],
    );
  }

  @override
  String toString() {
    return '$street, $city, $state, $zipCode, $country';
  }

}