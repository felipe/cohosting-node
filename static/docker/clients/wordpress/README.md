# WordPress (CLI)

This is a WordPress (4.9.2) PHP (7.2) Apache container that has `wp_cli` added into it.

You can access the cli by using the following command on a running container:
```bash
$ docker exec <container> wp
```

In order to export the database:
```bash
$ docker exec <container> wp db export wp-content/<filename>.sql
```
