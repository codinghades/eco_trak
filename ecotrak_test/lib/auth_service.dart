import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'user_model.dart';
import 'dart:developer';

class AuthService {
  final FirebaseAuth _auth = FirebaseAuth.instance;
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;

  // Get current user stream
  Stream<User?> get authStateChanges => _auth.authStateChanges();

  // Get current user
  User? get currentUser => _auth.currentUser;

  // Sign up with email and password
  Future<UserCredential?> signUpWithEmailAndPassword({
    required String email,
    required String password,
    required String fullName,
    required String barangay,
    required String street,
  }) async {
    try {
      // Create user with email and password
      UserCredential result = await _auth.createUserWithEmailAndPassword(
        email: email.trim(),
        password: password,
      );

      User? user = result.user;
      if (user != null) {
        // Send email verification
        await user.sendEmailVerification();

        // Create user document in Firestore
        UserModel userModel = UserModel(
          id: user.uid,
          fullName: fullName.trim(),
          email: email.trim().toLowerCase(),
          barangay: barangay.trim(),
          street: street.trim(),
          role: 'resident', // Default role for self-registration
          isCreatedByAdmin: false,
          createdAt: DateTime.now(),
          isEmailVerified: false,
        );

        await _firestore
            .collection('users')
            .doc(user.uid)
            .set(userModel.toMap());

        log("✅ User document created successfully in Firestore"); // Debug log
      }

      return result;
    } on FirebaseAuthException catch (e) {
      log("🔥 Firebase Auth Error: ${e.code} - ${e.message}"); // Debug log
      throw _getAuthException(e);
    } on Exception catch (e) {
      log("💥 Firestore Error: ${e.toString()}"); // Debug log
      throw 'Failed to create user profile: ${e.toString()}';
    } catch (e) {
      log("❌ Unexpected Error: ${e.toString()}"); // Debug log
      throw 'An unexpected error occurred: ${e.toString()}';
    }
  }

  // Sign in with email and password
  Future<UserCredential?> signInWithEmailAndPassword({
    required String email,
    required String password,
  }) async {
    try {
      UserCredential result = await _auth.signInWithEmailAndPassword(
        email: email.trim().toLowerCase(),
        password: password,
      );

      // Update last login time
      if (result.user != null) {
        await _firestore.collection('users').doc(result.user!.uid).update({
          'lastLogin': DateTime.now().toIso8601String(),
        });
      }

      return result;
    } on FirebaseAuthException catch (e) {
      throw _getAuthException(e);
    } catch (e) {
      throw 'An unexpected error occurred. Please try again.';
    }
  }

  // Get user data from Firestore
  Future<UserModel?> getUserData(String uid) async {
    try {
      DocumentSnapshot doc =
          await _firestore.collection('users').doc(uid).get();

      if (doc.exists) {
        return UserModel.fromMap(doc.data() as Map<String, dynamic>);
      }
      return null;
    } catch (e) {
      throw 'Failed to fetch user data.';
    }
  }

  // Send password reset email
  Future<void> sendPasswordResetEmail(String email) async {
    try {
      await _auth.sendPasswordResetEmail(email: email.trim().toLowerCase());
    } on FirebaseAuthException catch (e) {
      throw _getAuthException(e);
    } catch (e) {
      throw 'An unexpected error occurred. Please try again.';
    }
  }

  // Resend email verification
  Future<void> sendEmailVerification() async {
    try {
      User? user = _auth.currentUser;
      if (user != null && !user.emailVerified) {
        await user.sendEmailVerification();
      }
    } on FirebaseAuthException catch (e) {
      throw _getAuthException(e);
    } catch (e) {
      throw 'An unexpected error occurred. Please try again.';
    }
  }

  // Check if email is verified and update Firestore
  Future<void> checkEmailVerified() async {
    try {
      User? user = _auth.currentUser;
      if (user != null) {
        await user.reload();
        user = _auth.currentUser;

        if (user != null && user.emailVerified) {
          await _firestore
              .collection('users')
              .doc(user.uid)
              .update({'isEmailVerified': true});
        }
      }
    } catch (e) {
      // Handle silently or log error
    }
  }

// Enhanced AuthService signOut method (add this to your auth_service.dart)
// Sign out with better error handling
  Future<void> signOut() async {
    try {
      await _auth.signOut();
      log("✅ User signed out successfully"); // Debug log
    } on FirebaseAuthException catch (e) {
      log("🔥 Firebase Auth signOut error: ${e.code} - ${e.message}");
      throw 'Failed to sign out: ${e.message}';
    } catch (e) {
      log("💥 Unexpected signOut error: ${e.toString()}");
      throw 'Failed to sign out. Please try again.';
    }
  }

  // Delete account
  Future<void> deleteAccount() async {
    try {
      User? user = _auth.currentUser;
      if (user != null) {
        // Delete user document from Firestore
        await _firestore.collection('users').doc(user.uid).delete();

        // Delete user account
        await user.delete();
      }
    } on FirebaseAuthException catch (e) {
      throw _getAuthException(e);
    } catch (e) {
      throw 'Failed to delete account. Please try again.';
    }
  }

  // Update user profile
  Future<void> updateUserProfile({
    required String uid,
    required Map<String, dynamic> data,
  }) async {
    try {
      await _firestore.collection('users').doc(uid).update(data);
    } catch (e) {
      throw 'Failed to update profile. Please try again.';
    }
  }

  // Helper method to handle Firebase Auth exceptions
  String _getAuthException(FirebaseAuthException e) {
    switch (e.code) {
      case 'user-not-found':
        return 'No user found with this email address.';
      case 'wrong-password':
        return 'Incorrect password. Please try again.';
      case 'email-already-in-use':
        return 'An account already exists with this email address.';
      case 'weak-password':
        return 'Password is too weak. Please use at least 6 characters.';
      case 'invalid-email':
        return 'Please enter a valid email address.';
      case 'user-disabled':
        return 'This account has been disabled.';
      case 'too-many-requests':
        return 'Too many failed attempts. Please try again later.';
      case 'operation-not-allowed':
        return 'Sign in with email and password is not enabled.';
      case 'invalid-credential':
        return 'Invalid email or password.';
      default:
        return e.message ?? 'An authentication error occurred.';
    }
  }

  // Validate email format
  static bool isValidEmail(String email) {
    return RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$').hasMatch(email);
  }

  // Validate password strength
  static bool isValidPassword(String password) {
    // At least 6 characters, contains at least one letter and one number
    return password.length >= 6 &&
        RegExp(r'^(?=.*[A-Za-z])(?=.*\d)').hasMatch(password);
  }

  // Get password validation message
  static String getPasswordValidationMessage(String password) {
    if (password.length < 6) {
      return 'Password must be at least 6 characters long';
    }
    if (!RegExp(r'^(?=.*[A-Za-z])').hasMatch(password)) {
      return 'Password must contain at least one letter';
    }
    if (!RegExp(r'^(?=.*\d)').hasMatch(password)) {
      return 'Password must contain at least one number';
    }
    return '';
  }
}
