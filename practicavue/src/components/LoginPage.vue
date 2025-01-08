<template>
    <v-app>
      <v-container fluid fill-height>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="4">
            <v-card>
              <v-card-title class="blue white--text">
                <span class="headline">Iniciar Sesión</span>
              </v-card-title>
              <v-card-text>
                <v-form ref="form" v-model="valid">
                  <v-text-field
                    v-model="email"
                    :rules="[rules.required, rules.email]"
                    label="Correo Electrónico"
                    required
                  ></v-text-field>
                  <v-text-field
                    v-model="password"
                    :rules="[rules.required]"
                    label="Contraseña"
                    type="password"
                    required
                  ></v-text-field>
                  <v-btn :disabled="!valid" color="blue" @click="login">Entrar</v-btn>
                </v-form>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-app>
  </template>
  
  <script>
  export default {
    data() {
      return {
        valid: false,
        email: '',
        password: '',
        rules: {
          required: value => !!value || 'Este campo es requerido.',
          email: value => /.+@.+\..+/.test(value) || 'Debes ingresar un correo válido.',
        },
      };
    },
    methods: {
      login() {
        // Aquí puedes manejar la lógica de autenticación
        console.log('Iniciando sesión con:', this.email, this.password);
      },
    },
  };
  </script>
  
  <style scoped>
  .v-card {
    margin-top: 50px;
  }
  </style>
  