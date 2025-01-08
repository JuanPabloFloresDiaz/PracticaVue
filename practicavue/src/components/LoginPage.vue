<template>
  <v-app>
    <v-container fluid>
      <v-row align="center" justify="center" class="fill-height">
        <v-col cols="12" sm="8" md="6">
          <v-card class="rounded-xl elevation-10 pa-6">
            <v-row>
              <!-- Sección Izquierda -->
              <v-col
                cols="12"
                md="6"
                class="purple darken-4 white--text text-center py-10"
              >
                <VuetifyLogo />
                <h1 class="font-weight-bold text-h4">VuetifyPractice</h1>
                <p>Proyecto practico de Vuetify</p>
              </v-col>

              <!-- Sección Derecha -->
              <v-col
                cols="12"
                md="6"
                class="pa-10 d-flex flex-column justify-center"
              >
                <h2 class="text-center mb-4">Inicio de sesión</h2>
                <v-form ref="loginForm" v-model="valid">
                  <v-text-field
                    v-model="email"
                    :rules="[rules.required, rules.email]"
                    label="Correo electrónico"
                    outlined
                    dense
                    required
                  ></v-text-field>

                  <v-text-field
                    v-model="password"
                    :rules="[rules.required]"
                    label="Contraseña"
                    type="password"
                    outlined
                    dense
                    required
                  ></v-text-field>

                  <v-row class="mt-4" justify="center">
                    <v-btn
                      color="light-blue-darken-4"
                      class="white--text"
                      @click="login"
                      >Entrar</v-btn
                    >
                  </v-row>
                </v-form>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
import VuetifyLogo from "@/components/VuetifyLogo.vue";
import AxiosRequest from "@/utils/AxiosRequest";
import { showAlert } from "@/plugins/sweetalert2";

export default {
  data() {
    return {
      valid: false,
      email: "",
      password: "",
      rules: {
        required: (value) => !!value || "Este campo es requerido.",
        email: (value) =>
          /.+@.+\..+/.test(value) || "Debes ingresar un correo válido.",
      },
    };
  },
  components: {
    VuetifyLogo,
  },
  methods: {
    async login() {
      if (this.email == "" || this.password == "") {
        showAlert({ status: false, message: "Debes llenar todos los campos" });
        return;
      } else {
        try {
          const response = await AxiosRequest("/usuarios_public/login", "C", {
            correo: this.email,
            clave: this.password,
          });
          showAlert({ status: true, message: response.message });
        } catch (error) {
          showAlert({
            status: false,
            message: error.message,
          });
        }
      }
    },
  },
};
</script>

<style scoped>
.fill-height {
  height: 100vh;
}
.v-card {
  overflow: hidden;
}
.pa-10 {
  padding: 40px;
}
</style>
