// import 'package:ecotrak_test/main.dart';
import 'package:ecotrak_test/auth_service.dart';
// import 'package:ecotrak_test/user_model.dart';
import 'package:ecotrak_test/resident/homepage.dart';
import 'package:flutter/material.dart';
// import 'package:firebase_core/firebase_core.dart';

class CreateAccountPage extends StatefulWidget {
  const CreateAccountPage({super.key});

  @override
  State<CreateAccountPage> createState() => _CreateAccountPageState();
}

class _CreateAccountPageState extends State<CreateAccountPage> {
  bool _obscurePassword = true;
  bool _obscureConfirmPassword = true;
  bool _isLoading = false;

  String? _selectedBarangay;
  String? _selectedStreet;

  final barangayList = ["San Juan", "Bombongan", "Brngy 3"];
  final streetList = ["Soriano St", "St. 2", "St. 3"];

  final TextEditingController fullNameController = TextEditingController();
  final TextEditingController emailController = TextEditingController();
  final TextEditingController passwordController = TextEditingController();
  final TextEditingController confirmPasswordController =
      TextEditingController();

  final AuthService _authService = AuthService();

  @override
  void dispose() {
    fullNameController.dispose();
    emailController.dispose();
    passwordController.dispose();
    confirmPasswordController.dispose();
    super.dispose();
  }

  Future<void> _handleCreateAccount() async {
    if (!_validateForm()) return;

    setState(() => _isLoading = true);

    try {
      final result = await _authService.signUpWithEmailAndPassword(
        email: emailController.text,
        password: passwordController.text,
        fullName: fullNameController.text,
        barangay: _selectedBarangay!,
        street: _selectedStreet!,
      );

      if (result?.user != null) {
        if (!mounted) return;

        // Show success message and email verification notice
        await _showEmailVerificationDialog();

        if (!mounted) return; // <-- Add this line

        // Navigate to homepage
        Navigator.pushAndRemoveUntil(
          context,
          MaterialPageRoute(builder: (context) => const DashboardPage()),
          (route) => false,
        );
      }
    } catch (e) {
      if (mounted) {
        _showErrorDialog(e.toString());
      }
    }

    if (mounted) {
      setState(() => _isLoading = false);
    }
  }

  bool _validateForm() {
    // Validate full name
    if (fullNameController.text.trim().isEmpty) {
      _showErrorDialog('Please enter your full name');
      return false;
    }

    if (fullNameController.text.trim().length < 2) {
      _showErrorDialog('Full name must be at least 2 characters long');
      return false;
    }

    // Validate email
    if (emailController.text.trim().isEmpty) {
      _showErrorDialog('Please enter your email address');
      return false;
    }

    if (!AuthService.isValidEmail(emailController.text.trim())) {
      _showErrorDialog('Please enter a valid email address');
      return false;
    }

    // Validate barangay
    if (_selectedBarangay == null || _selectedBarangay!.isEmpty) {
      _showErrorDialog('Please select your barangay');
      return false;
    }

    // Validate street
    if (_selectedStreet == null || _selectedStreet!.isEmpty) {
      _showErrorDialog('Please select your street');
      return false;
    }

    // Validate password
    if (passwordController.text.isEmpty) {
      _showErrorDialog('Please enter a password');
      return false;
    }

    String passwordValidation =
        AuthService.getPasswordValidationMessage(passwordController.text);
    if (passwordValidation.isNotEmpty) {
      _showErrorDialog(passwordValidation);
      return false;
    }

    // Validate password confirmation
    if (confirmPasswordController.text.isEmpty) {
      _showErrorDialog('Please confirm your password');
      return false;
    }

    if (passwordController.text != confirmPasswordController.text) {
      _showErrorDialog('Passwords do not match');
      return false;
    }

    return true;
  }

  void _showErrorDialog(String message) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text(
          'Error',
          style: TextStyle(color: Colors.red),
        ),
        content: Text(message),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text(
              'OK',
              style: TextStyle(color: Color(0xFF1A7740)),
            ),
          ),
        ],
      ),
    );
  }

  Future<void> _showEmailVerificationDialog() async {
    return showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => AlertDialog(
        title: const Text(
          'Account Created Successfully!',
          style: TextStyle(color: Color(0xFF1A7740)),
        ),
        content: const Text(
          'A verification email has been sent to your email address. Please verify your email to complete the registration process.',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text(
              'Continue',
              style: TextStyle(color: Color(0xFF1A7740)),
            ),
          ),
          TextButton(
            onPressed: () async {
              try {
                await _authService.sendEmailVerification();

                if (!mounted) return; // <-- Add this line

                Navigator.pop(context);
                _showSuccessDialog('Verification email sent again!');
              } catch (e) {
                if (!mounted) return; // <-- Add this line

                Navigator.pop(context);
                _showErrorDialog(
                  'Failed to resend verification email: ${e.toString()}',
                );
              }
            },
            child: const Text(
              'Resend Email',
              style: TextStyle(color: Colors.grey),
            ),
          ),
        ],
      ),
    );
  }

  void _showSuccessDialog(String message) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text(
          'Success',
          style: TextStyle(color: Color(0xFF1A7740)),
        ),
        content: Text(message),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text(
              'OK',
              style: TextStyle(color: Color(0xFF1A7740)),
            ),
          ),
        ],
      ),
    );
  }

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
                  const Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
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

            const SizedBox(height: 20),
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
                    suffixIcon: fullNameController.text.trim().length >= 2
                        ? Icons.check
                        : null,
                  ),
                  buildTextField(
                    "Email Address",
                    "e.g. JuanDelaCruz@gmail.com",
                    controller: emailController,
                    keyboardType: TextInputType.emailAddress,
                    suffixIcon:
                        AuthService.isValidEmail(emailController.text.trim())
                            ? Icons.check
                            : null,
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
                    showValidation: true,
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
                      onPressed: _isLoading ? null : _handleCreateAccount,
                      style: ElevatedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(vertical: 15),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(30),
                        ),
                        backgroundColor:
                            _isLoading ? Colors.grey : const Color(0xFF1A7740),
                      ),
                      child: _isLoading
                          ? const CircularProgressIndicator(
                              color: Colors.white,
                            )
                          : const Text(
                              "Create Account",
                              style: TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.bold,
                                color: Colors.white,
                              ),
                            ),
                    ),
                  ),

                  const SizedBox(height: 20),
                  // Back to login link
                  GestureDetector(
                    onTap: () => Navigator.pop(context),
                    child: const Text(
                      "Already have an account? Sign in",
                      style: TextStyle(
                        color: Color(0xFF1A7740),
                        decoration: TextDecoration.underline,
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
    TextInputType? keyboardType,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: const TextStyle(color: Colors.grey)),
        TextField(
          controller: controller,
          keyboardType: keyboardType,
          onChanged: (value) {
            setState(() {}); // Trigger rebuild to update validation icons
          },
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
    VoidCallback toggle, {
    bool showValidation = false,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: const TextStyle(color: Colors.grey)),
        TextField(
          controller: controller,
          obscureText: obscure,
          onChanged: (value) {
            if (showValidation) {
              setState(() {}); // Trigger rebuild for validation
            }
          },
          decoration: InputDecoration(
            suffixIcon: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                if (showValidation && controller.text.isNotEmpty)
                  Icon(
                    AuthService.getPasswordValidationMessage(controller.text)
                            .isEmpty
                        ? Icons.check
                        : Icons.close,
                    color: AuthService.getPasswordValidationMessage(
                                controller.text)
                            .isEmpty
                        ? Colors.green
                        : Colors.red,
                  ),
                IconButton(
                  icon: Icon(obscure ? Icons.visibility_off : Icons.visibility),
                  onPressed: toggle,
                ),
              ],
            ),
          ),
        ),
        if (showValidation && controller.text.isNotEmpty)
          Padding(
            padding: const EdgeInsets.only(top: 5),
            child: Text(
              AuthService.getPasswordValidationMessage(controller.text),
              style: TextStyle(
                color: AuthService.getPasswordValidationMessage(controller.text)
                        .isEmpty
                    ? Colors.green
                    : Colors.red,
                fontSize: 12,
              ),
            ),
          ),
        const SizedBox(height: 10),
      ],
    );
  }
}
