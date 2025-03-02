import 'package:agro_ecommerce_flutter/app/controllers/return_controller.dart';
import 'package:agro_ecommerce_flutter/app/controllers/user_controller.dart';
import 'package:agro_ecommerce_flutter/app/models/Invoice.dart';
import 'package:agro_ecommerce_flutter/app/models/Return.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:iconsax/iconsax.dart';
import 'package:pdf/pdf.dart';
import 'package:pdf/widgets.dart' as pw;
import 'package:path_provider/path_provider.dart';
import 'package:open_file/open_file.dart';
import 'dart:io';
import 'package:intl/intl.dart';

import '../../../common_widgets/rounded_container.dart';
import '../../../constants/app_colors.dart';
import '../../../constants/sizes.dart';
import '../../../utils/helper_functions.dart';
import '../../../models/order_model.dart';
import '../../../models/address_model.dart';
import '../../../controllers/order_controller.dart';
import '../../../controllers/address_controller.dart';

class OrderDetails extends StatelessWidget {
  final OrderModel order;
  final orderController = OrderController.instance;
  final addressController = AddressController.instance;
  final returnController = Get.put(ReturnController());
  final userController = UserController.instance;

  OrderDetails({Key? key, required this.order}) : super(key: key);

  int _getStepIndex(String status, String? returnStatus) {
    if (status.toUpperCase() == 'CANCELLED') return 1;
    if (returnStatus != null) {
      switch (returnStatus.toUpperCase()) {
        case 'PENDING': return 4;
        case 'APPROVED': return 5;
        case 'COMPLETED': return 6;
        default: return 3;
      }
    }

    switch (status.toUpperCase()) {
      case 'PENDING': return 0;
      case 'PROCESSING': return 1;
      case 'SHIPPED': return 2;
      case 'DELIVERED': return 3;
      default: return 0;
    }
  }

  List<Map<String, String>> _getSteps(String orderStatus, String? returnStatus) {
    final List<Map<String, String>> baseSteps = [
      {'label': 'Order Placed', 'description': 'Your order has been placed successfully'},
      {'label': 'Processing', 'description': 'We are preparing your order for shipment'},
      {'label': 'Shipped', 'description': 'Your order has been shipped'},
      {'label': 'Delivered', 'description': 'Your order has been delivered'},
      {'label': 'Return Requested', 'description': 'Return request is being processed'},
      {'label': 'Return Approved', 'description': 'Your return request has been approved'},
      {'label': 'Return Completed', 'description': 'Return process has been completed'},
    ];

    if (orderStatus.toUpperCase() == 'CANCELLED') {
      return [
        baseSteps[0],
        {'label': 'Cancelled', 'description': 'Your order has been cancelled'},
        ...List.filled(5, {'label': '', 'description': ''})
      ];
    }

    if (returnStatus == null) {
      return [
        ...baseSteps.sublist(0, 4),
        ...List.filled(3, {'label': '', 'description': ''})
      ];
    }
    final activeSteps = baseSteps.sublist(0, 4);
    switch (returnStatus.toUpperCase()) {
      case 'PENDING':
        activeSteps.add(baseSteps[4]);
        activeSteps.addAll(List.filled(2, {'label': '', 'description': ''}));
        break;
      case 'APPROVED':
        activeSteps.addAll(baseSteps.sublist(4, 6));
        activeSteps.add({'label': '', 'description': ''});
        break;
      case 'COMPLETED':
        activeSteps.addAll(baseSteps.sublist(4));
        break;
      default:
        activeSteps.addAll(List.filled(3, {'label': '', 'description': ''}));
    }

    return activeSteps;
  }

  Widget _buildStepper(String orderStatus, Return? returnOrder) {
    final steps = _getSteps(orderStatus, returnOrder?.status);
    final activeStep = _getStepIndex(orderStatus, returnOrder?.status);

    return Stepper(
      physics: NeverScrollableScrollPhysics(),
      currentStep: activeStep,
      controlsBuilder: (context, details) => Container(),
      steps: steps.map((step) {
        if (step['label']!.isEmpty) {
          return Step(
            title: Text(''),
            content: Container(),
            isActive: false,
            state: StepState.disabled,
          );
        }

        return Step(
          title: Text(step['label']!),
          content: Text(step['description']!),
          isActive: steps.indexOf(step) <= activeStep,
          state: steps.indexOf(step) <= activeStep
              ? StepState.complete
              : StepState.disabled,
        );
      }).toList(),
    );
  }

    void _showCancelDialog() {
    Get.dialog(
      AlertDialog(
        title: Text('Cancel Order'),
        content: Text('Are you sure you want to cancel this order?'),
        actions: [
          TextButton(
            onPressed: () => Get.back(),
            child: Text('No'),
          ),
          TextButton(
            onPressed: () {

              Get.back();
              Get.back(); // Go back to orders page
            },
            child: Text('Yes, Cancel Order', style: TextStyle(color: Colors.red)),
          ),
        ],
      ),
    );
  }

  void _showReturnDialog() {
    final TextEditingController reasonController = TextEditingController();

    Get.dialog(
      AlertDialog(
        title: Text('Return Order'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text('Are you sure you want to return this order?'),
            SizedBox(height: AppSizes.spaceBtwItems),
            TextField(
              controller: reasonController,
              decoration: InputDecoration(
                labelText: 'Return Reason',
                border: OutlineInputBorder(),
              ),
              maxLines: 3,
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Get.back(),
            child: Text('No'),
          ),
          TextButton(
            onPressed: () {
              final userId = userController.user.value.id;
              if (reasonController.text.trim().isEmpty) {
                Get.snackbar('Error', 'Please provide a reason for return');
                return;
              }
              returnController.requestReturn(
                  order.id,
                  userId!,
                  reasonController.text
              );
              Get.back();
            },
            child: Text('Yes, Return Order', style: TextStyle(color: Colors.orange)),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final dark = HelperFunctions.isDarkMode(context);
    returnController.getReturnByOrderId(order.id);
    return Scaffold(
      appBar: AppBar(
        title: Text('Order #${order.id}'),
      ),
      body: SingleChildScrollView(
        padding: EdgeInsets.all(AppSizes.defaultSpace),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [

            // Order Status Stepper
            Obx(() {
                  final returnOrder = returnController.currentReturn.value;

                  return RoundedContainer(
                    padding: EdgeInsets.all(AppSizes.md),
                    showBorder: true,
                    bgColor: dark ? AppColors.dark : AppColors.light,
                    child: _buildStepper(order.status, returnOrder),
                  );

            }),

            SizedBox(height: AppSizes.spaceBtwSections),

            // Main Content Row (using Row for larger screens, Column for mobile)
            LayoutBuilder(
              builder: (context, constraints) {
                if (constraints.maxWidth > 600) {
                  return Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Expanded(
                        flex: 2,
                        child: _buildOrderItems(context, dark),
                      ),
                      SizedBox(width: AppSizes.spaceBtwItems),
                      Expanded(
                        flex:1,
                        child: _buildShippingDetails(context, dark),
                      ),
                    ],
                  );
                } else {
                  return Column(
                    children: [
                      _buildOrderItems(context, dark),
                      SizedBox(height: AppSizes.spaceBtwSections),
                      _buildShippingDetails(context, dark),
                    ],
                  );
                }
              },
            ),
            SizedBox(height: AppSizes.spaceBtwSections),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                FutureBuilder(
                  future: orderController.fetchInvoice(order.id),
                  builder: (context, snapshot) {
                    return OutlinedButton.icon(
                      onPressed: () => _generateInvoice(order, snapshot.data!),
                      icon: Icon(Icons.download),
                      label: Text('Download Invoice',style: TextStyle(fontSize: 10),),
                    );
                  },
                ),
                SizedBox(width: AppSizes.spaceBtwItems),
                if (order.status.toUpperCase() == 'PENDING')
                  OutlinedButton.icon(
                    onPressed: _showCancelDialog,
                    icon: Icon(Icons.cancel, color: Colors.red),
                    label: Text('Cancel Order', style: TextStyle(color: Colors.red,fontSize: 10)),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.red.withOpacity(0.1),
                    ),
                  ),
                SizedBox(width: AppSizes.spaceBtwItems,),
                Obx((){
                  final returnOrder = returnController.currentReturn.value;
                  if(order.status == 'DELIVERED' && returnOrder == null){
                    return OutlinedButton.icon(
                        onPressed: _showReturnDialog,
                        icon: Icon(Icons.replay, color: Colors.orange),
                        label: Text('Return Order', style: TextStyle(color: Colors.orange,fontSize: 10)),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.orange.withOpacity(0.1),
                      ),
                    );
                  }
                  return SizedBox.shrink();
                })
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildOrderItems(BuildContext context, bool dark) {
    return RoundedContainer(
      padding: EdgeInsets.all(AppSizes.md),
      showBorder: true,
      bgColor: dark ? AppColors.dark : AppColors.light,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Order Items',
            style: Theme.of(context).textTheme.titleLarge,
          ),
          SizedBox(height: AppSizes.spaceBtwItems),
          ...order.items.map((item) => Padding(
            padding: EdgeInsets.only(bottom: AppSizes.spaceBtwItems),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        item.productName,
                        style: Theme.of(context).textTheme.titleMedium,
                      ),
                      Text(
                        item.productBrand,
                        style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                          color: Colors.grey,
                        ),
                      ),
                    ],
                  ),
                ),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    Text(
                      '₹${item.price} × ${item.quantity}',
                      style: Theme.of(context).textTheme.titleMedium,
                    ),
                    Text(
                      '₹${item.price * item.quantity}',
                      style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                        color: Colors.grey,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          )).toList(),
          Divider(),
          Align(
            alignment: Alignment.centerRight,
            child: Text(
              'Total: ₹${order.totalAmount}',
              style: Theme.of(context).textTheme.titleLarge,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildShippingDetails(BuildContext context, bool dark) {
    return RoundedContainer(
      width: double.infinity,
      padding: EdgeInsets.all(AppSizes.md),
      showBorder: true,
      bgColor: dark ? AppColors.dark : AppColors.light,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Shipping Details',
            style: Theme.of(context).textTheme.titleLarge,
          ),
          SizedBox(height: AppSizes.spaceBtwItems),
          FutureBuilder(
            future: addressController.fetchAddress(order.addressId),
            builder: (context, snapshot) {
              if (snapshot.connectionState == ConnectionState.waiting) {
                return Center(child: CircularProgressIndicator());
              }

              if (snapshot.hasError || !snapshot.hasData) {
                return Text('Address not available');
              }

              final address = snapshot.data!;
              return Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(address.name),
                  Text(address.street ?? ''),
                  Text('${address.city}, ${address.state}, ${address.country}'),
                  Text(address.zipCode ?? ''),
                  Text('Phone: ${address.phoneNo}'),
                ],
              );
            },
          ),
        ],
      ),
    );
  }

  Future<void> _generateInvoice(OrderModel order, Invoice invoice) async {
    final address = await addressController.fetchAddress(order.addressId);
    if (address == null) return;

    final pdf = pw.Document();

    pdf.addPage(
      pw.Page(
        build: (pw.Context context) {
          return pw.Column(
            crossAxisAlignment: pw.CrossAxisAlignment.start,
            children: [
              pw.Text('INVOICE', style: pw.TextStyle(fontSize: 24, fontWeight: pw.FontWeight.bold)),
              pw.SizedBox(height: 20),
              pw.Text('Invoice No: ${invoice.invoiceNumber}'),
              pw.Text('Date: ${DateFormat('dd/MM/yyyy').format(invoice.invoiceDate)}'),
              pw.SizedBox(height: 20),
              pw.Text('Shipping Address:'),
              pw.Text(address.name),
              pw.Text(address.street ?? ''),
              pw.Text('${address.city}, ${address.state}, ${address.country}'),
              pw.Text(address.zipCode ?? ''),
              pw.Text('Phone: ${address.phoneNo}'),
              pw.SizedBox(height: 20),
              pw.Table(
                border: pw.TableBorder.all(),
                children: [
                  pw.TableRow(
                    children: [
                      pw.Text('Product'),
                      pw.Text('Brand'),
                      pw.Text('Quantity'),
                      pw.Text('Price'),
                      pw.Text('Total'),
                    ],
                  ),
                  ...order.items.map((item) => pw.TableRow(
                    children: [
                      pw.Text(item.productName),
                      pw.Text(item.productBrand),
                      pw.Text(item.quantity.toString()),
                      pw.Text('₹${item.price}'),
                      pw.Text('₹${item.quantity * item.price}'),
                    ],
                  )),
                ],
              ),
              pw.SizedBox(height: 20),
              pw.Row(
                mainAxisAlignment: pw.MainAxisAlignment.start,
                children: [
                  pw.Text('Total Amount:'),
                  pw.Text('₹${order.totalAmount}'),
                ],
              ),
            ],
          );
        },
      ),
    );

    final output = await getTemporaryDirectory();
    final file = File('${output.path}/${invoice.invoiceNumber}.pdf');
    await file.writeAsBytes(await pdf.save());

    OpenFile.open(file.path);
  }
}