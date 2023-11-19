// script.js
$(document).ready(function () {
    $('#registrationForm').submit(function (e) {
        if ($('#username').val() === '' || $('#email').val() === '' || $('#password').val() === '') {
            alert('Please fill in all fields.');
            e.preventDefault();
        }
    });

    $('#loginForm').submit(function (e) {
        e.preventDefault();
        $.ajax({
            type: 'POST',
            url: 'login.php',
            data: $(this).serialize(),
            success: function (response) {
                if (response === 'success') {
                    $('#registrationContainer, #loginContainer').hide();
                    $('#dashboardContainer').show();
                    loadUserData();
                    loadUserPosts();
                } else {
                    alert('Invalid email or password.');
                }
            }
        });
    });

    // Function to handle post submission
    $('#postForm').submit(function (e) {
        e.preventDefault();

        // Get post content
        var postContent = $('#postContent').val();

        // Perform AJAX request
        $.ajax({
            type: 'POST',
            url: 'create_post.php',
            data: { postContent: postContent },
            success: function (response) {
                if (response === 'success') {
                    $('#postContent').val('');
                    loadUserPosts();
                } else {
                    alert('Failed to create post.');
                }
            }
        });
    });

    function loadUserData() {
        $.ajax({
            type: 'GET',
            url: 'get_user_data.php',
            success: function (data) {
                var userData = JSON.parse(data);
                $('#welcomeUsername').text(userData.username);
                $('#userEmail').text(userData.email);
            }
        });
    }
  
    function loadUserPosts() {
        $.ajax({
            type: 'GET',
            url: 'get_user_posts.php',
            success: function (data) {
                var posts = JSON.parse(data);
                displayUserPosts(posts);
            }
        });
    }

    function displayUserPosts(posts) {
        var postsContainer = $('#userPosts');
        postsContainer.empty();
        posts.forEach(function (post) {
            var postItem = $('<li class="post"></li>').text(post.content);
            postsContainer.append(postItem);
        });
    }
});
