import 'package:flutter/material.dart';

class ChangeUserInfoPage extends StatefulWidget {
  const ChangeUserInfoPage({super.key});

  @override
  State<ChangeUserInfoPage> createState() => _ChangeUserInfoPageState();
}

class _ChangeUserInfoPageState extends State<ChangeUserInfoPage> {
  bool obscurePassword = true;
  bool obscureConfirmPassword = true;

// local data shit

  final TextEditingController usernameController =
      TextEditingController(text: "Robert Vidanes");
  final TextEditingController emailController =
      TextEditingController(text: "weljun@yahoo.com");
  final TextEditingController phoneController =
      TextEditingController(text: "09192377241");
  final TextEditingController streetController =
      TextEditingController(text: "Soriano");
  final TextEditingController passwordController =
      TextEditingController(text: "********");
  final TextEditingController confirmPasswordController =
      TextEditingController(text: "********");

  String selectedNotification = "Push";
  String selectedBarangay = "San Juan";

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        leading: const BackButton(color: Colors.black),
        title: const Text(
          "Change User Info",
          style: TextStyle(color: Colors.black),
        ),
        centerTitle: true,
        backgroundColor: Colors.white,
        elevation: 0,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            // Profile Image
            Column(
              children: [
                const CircleAvatar(
                  radius: 45,
                  backgroundImage: AssetImage("assets/images/yoshi.png"),
                ),
                const SizedBox(height: 8),
                GestureDetector(
                  onTap: () {
                    // Change photo logic
                  },
                  child: const Text(
                    "Change Photo?",
                    style: TextStyle(
                        color: Colors.green, fontWeight: FontWeight.bold),
                  ),
                ),
              ],
            ),
            const Divider(height: 32),

            // Username
            _buildTextField("Username", usernameController),

            // Email
            _buildTextField("Email", emailController),

            // Phone + Notification Pref
            Row(
              children: [
                Expanded(
                    child: _buildTextField("Phone", phoneController)),
                const SizedBox(width: 8),
                Expanded(
                  child: _buildDropdown(
                    label: "Notification Pref.",
                    value: selectedNotification,
                    items: const ["Push", "Email", "SMS"],
                    onChanged: (val) {
                      setState(() => selectedNotification = val!);
                    },
                  ),
                ),
              ],
            ),

            // Barangay + Street
            Row(
              children: [
                Expanded(
                  child: _buildDropdown(
                    label: "Barangay",
                    value: selectedBarangay,
                    items: const ["San Juan", "San Pedro", "San Isidro"],
                    onChanged: (val) {
                      setState(() => selectedBarangay = val!);
                    },
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                    child: _buildTextField("Street", streetController)),
              ],
            ),

            // Password
            _buildPasswordField("Password", passwordController, obscurePassword,
                () {
              setState(() => obscurePassword = !obscurePassword);
            }),

            // Confirm Password
            _buildPasswordField(
                "Confirm Password", confirmPasswordController,
                obscureConfirmPassword, () {
              setState(() => obscureConfirmPassword =
                  !obscureConfirmPassword);
            }),

            const SizedBox(height: 20),

            // Save Button
            SizedBox(
              width: double.infinity,
              height: 48,
              child: ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.green.shade400,
                  shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(8)),
                ),
                onPressed: () {
                  // Save logic
                },
                child: const Text(
                  "Save",
                  style: TextStyle(fontSize: 16, color: Colors.white),
                ),
              ),
            )
          ],
        ),
      ),
    );
  }

  Widget _buildTextField(
      String label, TextEditingController controller) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: TextField(
        controller: controller,
        decoration: InputDecoration(
          labelText: label,
          filled: true,
          fillColor: Colors.grey.shade200,
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(8),
            borderSide: BorderSide.none,
          ),
        ),
      ),
    );
  }

  Widget _buildDropdown({
    required String label,
    required String value,
    required List<String> items,
    required ValueChanged<String?> onChanged,
  }) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: InputDecorator(
        decoration: InputDecoration(
          labelText: label,
          filled: true,
          fillColor: Colors.grey.shade200,
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(8),
            borderSide: BorderSide.none,
          ),
        ),
        child: DropdownButtonHideUnderline(
          child: DropdownButton<String>(
            value: value,
            isDense: true,
            onChanged: onChanged,
            items: items
                .map((item) =>
                    DropdownMenuItem(value: item, child: Text(item)))
                .toList(),
          ),
        ),
      ),
    );
  }

  Widget _buildPasswordField(String label,
      TextEditingController controller, bool obscure, VoidCallback toggle) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: TextField(
        controller: controller,
        obscureText: obscure,
        decoration: InputDecoration(
          labelText: label,
          filled: true,
          fillColor: Colors.grey.shade200,
          suffixIcon: IconButton(
            icon: Icon(
                obscure ? Icons.visibility_off : Icons.visibility,
                color: Colors.grey),
            onPressed: toggle,
          ),
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(8),
            borderSide: BorderSide.none,
          ),
        ),
      ),
    );
  }
}
