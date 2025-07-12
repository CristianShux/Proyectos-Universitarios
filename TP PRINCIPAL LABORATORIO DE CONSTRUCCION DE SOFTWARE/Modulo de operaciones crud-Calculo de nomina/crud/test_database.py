from database import db  # Importa tu instancia de Database

def test_connection():
    try:
        cursor = db.get_cursor()
        cursor.execute("SELECT 1")  # Query simple para probar la conexión
        result = cursor.fetchone()
        print("✅ Conexión exitosa. Resultado de prueba:", result[0])
    except Exception as e:
        print(f"❌ Error en la conexión: {e}")
    finally:
        db.close()  # Cierra la conexión

if __name__ == "__main__":
    test_connection()