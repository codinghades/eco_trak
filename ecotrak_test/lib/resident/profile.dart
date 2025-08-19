import 'package:ecotrak_test/resident/homepage.dart';
import 'package:ecotrak_test/resident/profile_change.dart';
import 'package:flutter/material.dart';

// Your ProfilePage
class ProfilePage extends StatelessWidget {
  const ProfilePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        leading: BackButton(
          color: Colors.black, 
          onPressed: () {
            Navigator.push(
              context,
              MaterialPageRoute(
                builder: (context) => const DashboardPage(), //GO BACK SA HOMESCREEN
              ),
            );
          },
        ),
        title: const Text(
          "My Profile",
          style: TextStyle(color: Colors.black),
        ),
        centerTitle: true,
        backgroundColor: Colors.white,
        elevation: 0,
        actions: [
          IconButton(
            icon: const Icon(Icons.edit, color: Colors.black),
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => const ChangeUserInfoPage(),
                ),
              );
            },
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            Column(
              children: const [
                CircleAvatar(
                  radius: 45,
                  backgroundImage: AssetImage(
                    'assets/images/yoshi.png',
                  ),
                ),
                SizedBox(height: 8),
                Text("Resident", style: TextStyle(color: Colors.grey)),
                SizedBox(height: 4),
                Text(
                  "Robert Vidanes",
                  style: TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 20,
                    color: Colors.green,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 24),

            // Info tiles
            _ProfileInfoTile(
              icon: Icons.person,
              label: "Username",
              value: "Robert Vidanes",
            ),
            _ProfileInfoTile(
              icon: Icons.email,
              label: "Email",
              value: "robertvidanes@yahoo.com",
            ),
            _ProfileInfoTile(
              icon: Icons.phone,
              label: "Phone",
              value: "09192347342",
            ),
            _ProfileInfoTile(
              icon: Icons.home,
              label: "Barangay",
              value: "San Juan",
            ),
            _ProfileInfoTile(
              icon: Icons.location_on,
              label: "Street",
              value: "Soriano St",
            ),
            _ProfileInfoTile(
              icon: Icons.lock,
              label: "Password",
              value: "********",
              obscure: true,
            ),
            _ProfileInfoTile(
              icon: Icons.notifications,
              label: "Notification Preference",
              value: "Push Notification",
            ),
          ],
        ),
      ),
    );
  }
}

// Info Tile Widget
class _ProfileInfoTile extends StatelessWidget {
  final IconData icon;
  final String label;
  final String value;
  final bool obscure;

  const _ProfileInfoTile({
    required this.icon,
    required this.label,
    required this.value,
    this.obscure = false,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(icon, color: Colors.black54),
              const SizedBox(width: 8),
              Text(
                label,
                style: const TextStyle(color: Colors.black54, fontSize: 14),
              ),
            ],
          ),
          const SizedBox(height: 4),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(value, style: const TextStyle(fontSize: 16)),
              if (obscure)
                const Icon(Icons.visibility_off, color: Colors.black54),
            ],
          ),
          const Divider(),
        ],
      ),
    );
  }
}