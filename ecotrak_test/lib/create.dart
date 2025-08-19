import 'package:ecotrak_test/main.dart';
import 'package:flutter/material.dart';

class CreateAccountPage extends StatefulWidget {
  const CreateAccountPage({super.key});

  @override
  State<CreateAccountPage> createState() => _CreateAccountPageState();
}

class _CreateAccountPageState extends State<CreateAccountPage> {
  bool _obscurePassword = true;
  bool _obscureConfirmPassword = true;

  String? _selectedBarangay;
  String? _selectedStreet;

  final barangayList = ["San Juan", "Brngy 2", "Brngy 3"];
  final streetList = ["Soriano St", "St. 2", "St. 3"];

  final fullNameController = TextEditingController();
  final emailController = TextEditingController();
  final passwordController = TextEditingController();
  final confirmPasswordController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      body: SingleChildScrollView(
        child: Column(
          children: [
                Container(
                        width: double.infinity,
                        decoration: const BoxDecoration(
                          gradient: LinearGradient(
                            colors: [Color(0xFF1A7740), Color(0xFF0E3920)],
                            begin: Alignment.topCenter,
                            end: Alignment.bottomCenter,
                          ),
                          borderRadius: BorderRadius.only(
                            bottomLeft: Radius.circular(30),
                            bottomRight: Radius.circular(30),
                          ),
                        ),
                        padding: const EdgeInsets.all(20),
                        child: Row(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            // Left text
                            Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: const [
                                Text(
                                  "Create Your",
                                  style: TextStyle(color: Colors.white, fontSize: 22),
                                ),
                                Text(
                                  "Account!",
                                  style: TextStyle(
                                    color: Colors.white,
                                    fontSize: 22,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                              ],
                            ),
                            // Right logo + text
                            Column(
                              children: [
                                Container(
                                  width: 80,
                                  height: 80,
                                  color: Colors.white24,
                                  alignment: Alignment.center,
                                  child: const Text(
                                    "",
                                    style: TextStyle(color: Colors.white54),
                                  ),
                                ),
                                const SizedBox(height: 8),
                                const Text(
                                  "EcoTrak",
                                style: TextStyle(
                                  fontSize: 22,
                                  color: Colors.white,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
            
            SizedBox(height: 20),
            // White card form
            Container(
              transform: Matrix4.translationValues(0, -30, 0),
              width: double.infinity,
              padding: const EdgeInsets.all(20),
              decoration: const BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.only(
                  topLeft: Radius.circular(30),
                  topRight: Radius.circular(30),
                ),
              ),
              child: Column(
                children: [
                  buildTextField(
                    "Full Name",
                    "e.g. Juan Dela Cruz",
                    controller: fullNameController,
                    suffixIcon: Icons.check,
                  ),
                  buildTextField(
                    "Email or Phone Number",
                    "e.g. JuanDelaCruz@123mail.com",
                    controller: emailController,
                    suffixIcon: Icons.check,
                  ),
                  buildDropdown("Barangay", barangayList, _selectedBarangay, (
                    value,
                  ) {
                    setState(() => _selectedBarangay = value);
                  }),
                  buildDropdown("Street", streetList, _selectedStreet, (value) {
                    setState(() => _selectedStreet = value);
                  }),
                  buildPasswordField(
                    "Password",
                    passwordController,
                    _obscurePassword,
                    () {
                      setState(() => _obscurePassword = !_obscurePassword);
                    },
                  ),
                  buildPasswordField(
                    "Confirm Password",
                    confirmPasswordController,
                    _obscureConfirmPassword,
                    () {
                      setState(
                        () =>
                            _obscureConfirmPassword = !_obscureConfirmPassword,
                      );
                    },
                  ),
                  const SizedBox(height: 15),
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      onPressed: () { 
                        debugPrint("Name: ${fullNameController.text}");
                        debugPrint("Email: ${emailController.text}");
                        debugPrint("Barangay: $_selectedBarangay");
                        debugPrint("Street: $_selectedStreet");

                        Navigator.push(
                          context,
                          MaterialPageRoute(builder: (context) => const HomePage()),
                        );
                      },
                      style: ElevatedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(vertical: 15),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(30),
                        ),
                        backgroundColor: const Color(0xFF1A7740),
                      ),
                      child: const Text(
                        "Create Account",
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 10),
            const Text(
              "©Copyright EcoTrak 2025. All rights Reserved",
              style: TextStyle(color: Colors.white54, fontSize: 12),
            ),
            const SizedBox(height: 20),
          ],
        ),
      ),
    );
  }

  Widget buildTextField(
    String label,
    String hint, {
    IconData? suffixIcon,
    TextEditingController? controller,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: const TextStyle(color: Colors.grey)),
        TextField(
          controller: controller,
          decoration: InputDecoration(
            hintText: hint,
            suffixIcon: suffixIcon != null
                ? Icon(suffixIcon, color: Colors.green)
                : null,
          ),
        ),
        const SizedBox(height: 10),
      ],
    );
  }

  Widget buildDropdown(
    String label,
    List<String> items,
    String? value,
    ValueChanged<String?> onChanged,
  ) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: const TextStyle(color: Colors.grey)),
        DropdownButtonFormField<String>(
          value: items.contains(value) ? value : null,
          decoration: const InputDecoration(),
          items: items.map((item) {
            return DropdownMenuItem(value: item, child: Text(item));
          }).toList(),
          onChanged: onChanged,
        ),
        const SizedBox(height: 10),
      ],
    );
  }

  Widget buildPasswordField(
    String label,
    TextEditingController controller,
    bool obscure,
    VoidCallback toggle,
  ) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: const TextStyle(color: Colors.grey)),
        TextField(
          controller: controller,
          obscureText: obscure,
          decoration: InputDecoration(
            suffixIcon: IconButton(
              icon: Icon(obscure ? Icons.visibility_off : Icons.visibility),
              onPressed: toggle,
            ),
          ),
        ),
        const SizedBox(height: 10),
      ],
    );
  }
}
