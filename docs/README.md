
#  Visualizando diagramas Structurizr DSL no GitHub

Este projeto utiliza **Structurizr DSL** para gerar diagramas de arquitetura de software.
Como o GitHub não renderiza diagramas automaticamente a partir do `.dsl`, existem duas maneiras simples de visualizar os diagramas.

---

##  Opção 1 — Usar o Structurizr Lite através do Docker (recomendado)

> Para usar esse método é necessário possuir e entender um pouco de docker.

1. **Crie uma pasta no disco C:**

   ```
   C:\structurizrlite
   ```

2. **Coloque o arquivo do projeto dentro dessa pasta:**

   ```
   C:\structurizrlite\workspace.dsl
   ```

3. **Abra o Terminal / PowerShell e navegue até essa pasta:**

   ```powershell
   cd C:\structurizrlite
   ```

4. **Execute o Structurizr Lite usando Docker:**

   ```powershell
   docker run -it --rm -p 8080:8080 `
     -v C:/structurizrlite:/usr/local/structurizr `
     structurizr/lite
   ```

   De forma **generalizada**, o comando seria:

   ```powershell
   docker run -it --rm -p 8080:8080 \
     -v $PWD:/usr/local/structurizr \
     structurizr/lite
   ```
    onde o $PWD seria o caminho

   **Importante:** execute esse comando **dentro da pasta que contém o arquivo `workspace.dsl`**.

5. **Abra no navegador:**

   ```
   http://localhost:8080
   ```

Pronto! Os diagramas serão renderizados automaticamente a partir do arquivo **workspace.dsl**.

---

##  Opção 2 — Usar o editor online do Structurizr (mais simples)

1. Abra o site:
    [https://structurizr.com/dsl](https://structurizr.com/dsl)

2. Copie o conteúdo do arquivo `workspace.dsl`.

3. Cole no **textarea** do editor.

4. Clique no botão **Render** para visualizar os diagramas.


---

