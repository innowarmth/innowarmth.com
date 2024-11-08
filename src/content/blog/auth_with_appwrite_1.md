---
title: 'Flutter auth with Appwrite 1/4'
description: 'With this technical article, learn how to authenticate your users using Appwrite.'
pubDate: 'Oct 26 2024'
heroImage: 'blog/auth_with_appwrite_1/hero.png'
---

## A bit of context

In this article, we will focus on email/password authentication

## A schema

## The code

### The contract

Our `User` model can be as simple as this for now

```dart
class User {
  final String id;

  const User({required this.id});
}
```

Following our schema, we need a `UserRepository` that will be used by our controllers to authenticate the user and deal with our service (here Appwrite).

Here is what a basic `UserRepository` can look

```dart
/// [UserRepository] handles user authentication
/// and account creation
abstract class UserRepository {
  /// Get the currently authenticated user
  /// or null if not authenticated
  Future<User?> authenticatedUser();

  /// Create an account with email and password
  /// and return the user
  Future<User> createAccountWithEmailAndPassword({
    required String email,
    required String password,
  });

  /// Sign in with email and password
  /// and return the user
  Future<User> loginWithEmailAndPassword({
    required String email,
    required String password,
  });
}
```

### The implementation

As we are using `Riverpod` we need a provider for our AppWrite Client.
But this does not change the main content of what we are doing here, it is just a way to do dependency injection.

<em> I'm not using any local instance of Appwrite here, so I hit the production with `https://cloud.appwrite.io/v1` </em>

```dart
final appWriteProvider = Provider((ref) {
  return new Client()
    ..setEndpoint('https://cloud.appwrite.io/v1')
    /// Your project ID
    ..setProject('XXXXXXXXX')
    ..setSelfSigned(status: kDebugMode);
});
```

Now, we need our `AppwriteUserRepository`.

```dart
/// [AppwriteUserRepository] implements [UserRepository]
/// by using the Appwrite SDK
class AppwriteUserRepository implements UserRepository {
  final Account account;

  AppwriteUserRepository({
    required Client client,
  }) : account = Account(client);

}
```

So, we inject our client and use the `Account` part of it.

First thing first, we need to convert `Appwrite`'s, `User` class to our class.

<em>This is not mandatory, but helps if one day we want to switch our auth provider</em>

```dart
/// Prefix imports of appwrite models with an `a`
import 'package:appwrite/models.dart' as a;

/// Converts an appwrite [a.User] to a [User]
User _convertAppwriteUser(a.User u) {
  return User(
    id: u.$id,
  );
}
```

#### Get the current authenticated user

```dart
@override
Future<User?> authenticatedUser() async {
  try {
    final currentUser = await account.get();
    return _convertAppwriteUser(currentUser);
  } catch (e) {
    return null;
  }
}
```

> Be aware that, under the hood, this method will do an http call to `/account`, so it would be nice to cache the result for some time.

#### Create an account using email and password

```dart
@override
Future<User> createAccountWithEmailAndPassword(
  String email,
  String password,
) async {
  return account
      .create(
        userId: const Uuid().v4(),
        email: email,
        password: password,
      )
      .then(_convertAppwriteUser);
}
```

As you can see, `create` takes a `userId` parameter, it requires a unique identifier.
For our purpose, we will use `uuid` package and generate a <strong>v4 uuid</strong> to use.

#### Login using email and password

```dart
@override
Future<User> loginWithEmailAndPassword(String email, String password) async {
  return account
      .createEmailPasswordSession(email: email, password: password)
      .then((s) => account.get())
      .then(_convertAppwriteUser);
}
```

To log in, we will use the `createEmailPasswordSession` method that creates a `Session` instance.

The `Session` does contain the `userId` so we could have write this instead

```dart
return account
      .createEmailPasswordSession(email: email, password: password)
      .then((s) => User(id: s.userId))
```

But, as you might need other info from the user in a second time (email, name, status), it is better to fetch the `User` instead using `account.get()`

## Takeaway

Now using this code you are able to do a basic auth in your Flutter app using Appwrite.
In the next blog post, we will learn how to use social connect for Google and Apple