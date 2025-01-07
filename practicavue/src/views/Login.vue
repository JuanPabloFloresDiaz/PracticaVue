<template>
    <v-container fluid fill-height>
      <v-layout align-center justify-center>
        <v-flex xs12 sm8 md4>
          <v-card>
            <v-toolbar color="primary" dark>
              <v-toolbar-title>Iniciar Sesión</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <v-form ref="form" v-model="valid">
                <v-text-field
                  prepend-icon="mdi-email"
                  label="Correo Electrónico"
                  v-model="email"
                  :rules="[rules.required, rules.email]"
                  required
                ></v-text-field>
                <v-text-field
                  prepend-icon="mdi-lock"
                  label="Contraseña"
                  v-model="password"
                  :rules="[rules.required]"
                  type="password"
                  required
                ></v-text-field>
                <v-alert type="error" v-if="errorLogin">
                  Usuario o contraseña inválidos
                </v-alert>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" @click="login">Iniciar Sesión</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </template>
  
  <script>
  export default {
    data() {
      return {
        valid: false,
        email: '',
        password: '',
        errorLogin: false,
        rules: {
          required: value => !!value || 'Este campo es obligatorio',
          email: value => /.+@.+\..+/.test(value) || 'Correo no válido',
        },
      };
    },
    methods: {
      login() {
        if (this.$refs.form.validate()) {
          // Lógica de autenticación aquí
          // Ejemplo:
          this.errorLogin = false;
          // Simulación de autenticación
          if (this.email === 'test@example.com' && this.password === 'password') {
            this.$router.push('/');
          } else {
            this.errorLogin = true;
          }
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .v-layout {
    background-color: #f5f5f5;
  }
  </style>
  