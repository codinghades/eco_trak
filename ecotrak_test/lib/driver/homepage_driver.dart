import 'package:flutter/material.dart';
import 'package:ecotrak_test/driver/schedule_driver.dart';
import 'package:ecotrak_test/driver/tracking_driver.dart';
import 'package:ecotrak_test/driver/notification_driver.dart';
import 'package:ecotrak_test/driver/history_driver.dart';
import 'package:ecotrak_test/auth_service.dart';
// import 'package:ecotrak_test/main.dart'; // Ensure this is imported for AuthWrapper

// The DashboardPageDriver should not return a MaterialApp.
// It should return a Scaffold and its content.
class DashboardPageDriver extends StatelessWidget {
  const DashboardPageDriver({super.key});

  // The logout method should be defined here or in a separate service.
  // This approach keeps it clean and directly callable from the button.
  Future<void> _handleLogout(BuildContext context) async {
    try {
      await AuthService().signOut();
      // After signOut, the AuthWrapper in main.dart will automatically
      // detect the change and navigate to the login page.
      // So, we don't need manual navigation here.
    } catch (e) {
      if (!context.mounted) return;
      // Show error dialog
      showDialog(
        context: context,
        builder: (context) => AlertDialog(
          title: const Text('Error'),
          content: Text('Failed to sign out: ${e.toString()}'),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text('OK'),
            ),
          ],
        ),
      );
    }
  }

  // Helper method for the notification dialog
  Widget _buildNotificationDialog(BuildContext context) {
    return Dialog(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      insetPadding: const EdgeInsets.all(16),
      child: Container(
        padding: const EdgeInsets.all(16),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header Row
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  "Notification",
                  style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                ),
                TextButton(
                  onPressed: () => Navigator.pop(context),
                  child: const Text("Close", style: TextStyle(color: Colors.green)),
                ),
              ],
            ),
            const Divider(),
            _notificationItem("Collection Schedule", "June XX, XX:XX AM is Scheduled for San Juan...", "XX minutes ago"),
            _notificationItem("Collection Status", "Collection of Garbage has started in Brgy. San Juan", "XX minutes ago"),
            _notificationItem("Live Tracking", "Garbage Truck is now moving to Brgy. San Juan", "X minutes ago"),
          ],
        ),
      ),
    );
  }

  Widget _notificationItem(String title, String subtitle, String time) {
    return Container(
      margin: const EdgeInsets.symmetric(vertical: 6),
      padding: const EdgeInsets.all(10),
      decoration: BoxDecoration(
        color: Colors.green.shade50,
        borderRadius: BorderRadius.circular(8),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(title, style: const TextStyle(fontWeight: FontWeight.bold)),
              Text(time, style: const TextStyle(fontSize: 12, color: Colors.grey)),
            ],
          ),
          const SizedBox(height: 4),
          Text(subtitle, style: const TextStyle(color: Colors.black54)),
        ],
      ),
    );
  }

  Widget _menuButton({required IconData icon, required String label, required VoidCallback onTap}) {
    return InkWell(
      onTap: onTap,
      child: Column(
        children: [
          Icon(icon, color: Colors.white),
          const SizedBox(height: 4),
          Text(label, style: const TextStyle(color: Colors.white)),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: Column(
          children: [
            // Top Bar
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 10),
              child: Row(
                children: [
                  const CircleAvatar(
                    radius: 24,
                    backgroundImage: AssetImage('assets/images/yoshi.png'),
                  ),
                  const SizedBox(width: 10),
                  const Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          "Driver",
                          style: TextStyle(fontSize: 12, color: Colors.grey),
                        ),
                        Text.rich(
                          TextSpan(
                            children: [
                              TextSpan(text: "Hello, ", style: TextStyle(fontSize: 16)),
                              TextSpan(
                                text: "Kevin",
                                style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                  IconButton(
                    icon: const Icon(Icons.notifications_none),
                    onPressed: () {
                      showDialog(
                        context: context,
                        builder: (context) => _buildNotificationDialog(context),
                      );
                    },
                  ),
                  // Logout Button
                  IconButton(
                    icon: const Icon(Icons.logout),
                    onPressed: () {
                      showDialog(
                        context: context,
                        builder: (context) => AlertDialog(
                          title: const Text('Confirm Logout'),
                          content: const Text('Are you sure you want to sign out?'),
                          actions: [
                            TextButton(
                              onPressed: () => Navigator.pop(context),
                              child: const Text('Cancel'),
                            ),
                            TextButton(
                              onPressed: () {
                                Navigator.pop(context);
                                _handleLogout(context); // This will now work correctly
                              },
                              style: TextButton.styleFrom(foregroundColor: Colors.red),
                              child: const Text('Sign Out'),
                            ),
                          ],
                        ),
                      );
                    },
                  ),
                ],
              ),
            ),
            // Menu Button
            Container(
              color: Colors.green.shade800,
              padding: const EdgeInsets.symmetric(vertical: 12),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: [
                  _menuButton(
                    icon: Icons.schedule,
                    label: "Schedule",
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (context) => const SchedulePageDriver()),
                      );
                    },
                  ),
                  _menuButton(
                    icon: Icons.location_on,
                    label: "Tracking",
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (context) => const TrackingPageDriver()),
                      );
                    },
                  ),
                  _menuButton(
                    icon: Icons.report_problem,
                    label: "Notify",
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (context) => const NotificationPageDriver()),
                      );
                    },
                  ),
                  _menuButton(
                    icon: Icons.history,
                    label: "History",
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (context) => const HistoryPageDriver()),
                      );
                    },
                  ),
                ],
              ),
            ),
            // Main content
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text.rich(
                      TextSpan(
                        children: [
                          TextSpan(text: "Welcome, to "),
                          TextSpan(
                            text: "EcoTrak",
                            style: TextStyle(fontWeight: FontWeight.bold, color: Colors.green),
                          ),
                        ],
                      ),
                      style: TextStyle(fontSize: 18),
                    ),
                    const SizedBox(height: 4),
                    const Text(
                      "Soriano Street Schedule: March 29, 2025 | 9:00 AM",
                      style: TextStyle(color: Colors.grey),
                    ),
                    const SizedBox(height: 4),
                    const Text(
                      "Status: Ongoing",
                      style: TextStyle(color: Colors.green, fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(height: 10),
                    // Map placeholder
                    Container(
                      height: 160,
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(12),
                        image: const DecorationImage(
                          image: AssetImage('assets/images/yoshi.png'),
                          fit: BoxFit.cover,
                        ),
                      ),
                      child: Center(
                        child: Container(
                          padding: const EdgeInsets.symmetric(vertical: 6, horizontal: 14),
                          decoration: BoxDecoration(
                            color: Colors.black54,
                            borderRadius: BorderRadius.circular(20),
                          ),
                          child: const Text(
                            "Click to track",
                            style: TextStyle(color: Colors.white),
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(height: 10),
                    // Notification
                    Container(
                      decoration: BoxDecoration(
                        border: Border.all(color: Colors.grey.shade300),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      padding: const EdgeInsets.all(8),
                      child: const Row(
                        children: [
                          Icon(Icons.circle, size: 12, color: Colors.green),
                          SizedBox(width: 8),
                          Expanded(
                            child: Text(
                              "Notification | The garbage truck is 5 minutes away",
                              style: TextStyle(fontSize: 14),
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 16),
                    // Reminders
                    const Text(
                      "EcoTrak Reminders",
                      style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                    ),
                    const SizedBox(height: 4),
                    const Text(
                      '"Remember to place your bins outside by 8:30 AM on collection days."',
                      style: TextStyle(color: Colors.grey),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}